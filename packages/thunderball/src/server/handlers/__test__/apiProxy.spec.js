import request from 'request';
import { Readable } from 'stream';
import apiProxy, { joinProxyPath } from '../apiProxy';

jest.mock('request');

let spyOn;

request.mockImplementation(() => {
  const s = new Readable();
  s.push('test API response');
  s.push(null);
  spyOn = jest.spyOn(s, 'on');
  return s;
});


describe('apiProxy', () => {
  const req = {
    originalUrl: '/my_proxy_path/foo',
    url: '/foo', // app.use removes mount point (e.g. my_proxy_path)
    pipe: jest.fn().mockReturnThis(),
    method: 'GET',
  };
  const res = {
    format: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    setHeader: jest.fn(),
  };
  const next = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    apiProxy('http://localhost:9000/pretend_server', '')(req, res, next);
  });
  it('makes the API request with the joined proxy path (proxy url + proxy path)', async () => {
    expect(request).toHaveBeenCalledWith('http://localhost:9000/pretend_server/foo');
  });
  it('pipes the API response to the proxy response', async () => {
    expect(req.pipe).toHaveBeenLastCalledWith(res);
  });
  it('registers error handler to send 500 response', () => {
    const [error, errorHandler] = spyOn.mock.calls[0];
    expect(error).toEqual('error');
    const testError = new Error('test');
    testError.code = 'test_error_code';
    errorHandler(testError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: 'test_error_code',
    });
  });
});

describe('joinProxyPath', () => {
  it('combines request url with the path url', () => {
    const joined = joinProxyPath('my_api/v1/foo?say=hello', 'my_api');
    expect(joined).toEqual('/my_api/my_api/v1/foo?say=hello');
  });
  it('uses request url if path url is empty', () => {
    const joined = joinProxyPath('my_api/v1/foo?say=hello', '');
    expect(joined).toEqual('/my_api/v1/foo?say=hello');
  });

  it('removes extra slashes', () => {
    const joined = joinProxyPath('///my_api////v1///foo///?say=hello', 'my_api');
    expect(joined).toEqual('/my_api/my_api/v1/foo?say=hello');
  });
});

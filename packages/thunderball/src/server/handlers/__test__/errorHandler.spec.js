import constants from '../../../constants';
import errorHandler from '../errorHandler';

jest.mock('../../../constants');

const res = {
  format: jest.fn(),
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
};
let formatter;
const error = new Error('Some test error');
error.stack = 'test error fake stack';

describe('errorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('non-production env', () => {
    beforeEach(() => {
      constants.IS_PRODUCTION = false;
      errorHandler(error, null, res, null);
      formatter = res.format.mock.calls[0][0];
    });
    it('sends 500 response status', () => {
      expect(res.status).toHaveBeenCalledWith(500);
    });
    it('supports JSON response format', () => {
      formatter.json();
      expect(res.send).toHaveBeenCalledWith({
        error: 'Error: Some test error',
        details: 'test error fake stack',
      });
    });
    it('supports HTML response format', () => {
      formatter.html();
      expect(res.send).toHaveBeenCalledWith(
        '<h1>500 Internal server error</h1>\n<pre>test error fake stack</pre>',
      );
    });
    it('supports default text response format', () => {
      formatter.default();
      expect(res.send).toHaveBeenCalledWith('500 Internal server error:\ntest error fake stack');
    });
  });
  describe('production env', () => {
    beforeEach(() => {
      constants.IS_PRODUCTION = true;
      errorHandler(error, null, res, null);
      formatter = res.format.mock.calls[0][0];
    });
    it('sends 500 response status', () => {
      expect(res.status).toHaveBeenCalledWith(500);
    });
    it('supports JSON response format', () => {
      formatter.json();
      expect(res.send).toHaveBeenCalledWith({
        error: 'Error: Some test error',
      });
    });
    it('supports HTML response format', () => {
      formatter.html();
      expect(res.send).toHaveBeenCalledWith(
        '<h1>500 Internal server error</h1>\n<p>Something went wrong</p>',
      );
    });
    it('supports default text response format', () => {
      formatter.default();
      expect(res.send).toHaveBeenCalledWith('500 Internal server error:\nSomething went wrong');
    });
  });
});

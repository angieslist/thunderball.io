import constants from '../../../constants';
import app from '../../app';
import apiProxy from '../apiProxy';

jest.mock('../apiProxy');
jest.mock('../../../constants');
jest.mock('../../app');

constants.APP_CONFIG = {
  proxyRoutes: [{
    path: 'my_api',
    proxyUrl: 'http://localhost:8001',
    includeBase: true,
  }, {
    path: 'my_api2',
    proxyUrl: 'http://localhost:8002',
    includeBase: false,
  }],
};

require('../apiProxyHandler');

describe('apiProxyHandler', () => {
  it('adds api proxy middleware', () => {
    expect(app.use).toHaveBeenCalledWith('/my_api', undefined);
    expect(app.use).toHaveBeenCalledWith('/my_api2', undefined);
    expect(apiProxy).toHaveBeenCalledWith('http://localhost:8001', 'my_api');
    expect(apiProxy).toHaveBeenCalledWith('http://localhost:8002', '');
  });
});

import constants from '../../../constants';
import app from '../../app';
import ionMiddlewareExample from './ionMiddlewareExample';

jest.mock('../../app');
jest.mock('../../../constants');
jest.mock('./ionMiddlewareExample', () => jest.fn(() => jest.fn()));

constants.APP_IONS = [{
  dir: __dirname,
  config: {
    middleware: './ionMiddlewareExample',
  },
}];

require('../ionMiddlewareHandler');

describe('ionMiddlewareHandler', () => {
  it('applies ion middleware', () => {
    expect(ionMiddlewareExample)
      .toHaveBeenCalledWith(constants.APP_CONFIG, constants.APP_IONS, app);
    expect(app.use).toHaveBeenCalled();
  });
});

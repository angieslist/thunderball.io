import setupIonSpaRoutes from '../setupIonSpaRoutes';
import constants from '../../../../constants';
import render from '../render';
import createRoutes from './createRoutes';
import injector from './injector';

jest.mock('express');
jest.mock('../../../../constants');
jest.mock('../../../logger');
jest.mock('../render');

const app = {
  get: jest.fn(),
};
const renderMiddleware = () => { };
render.mockReturnValue(renderMiddleware);

constants.APP_IONS_DIR = '';
constants.APP_IONS = [{
  name: 'login',
  dir: __dirname,
  config: {
    browser: {
      page: {
        createRoutes: './createRoutes',
        path: [
          '/login*',
          '/sign-up*',
        ],
        injectors: [
          './injector',
        ],
      },
    },
  },
}, {
  name: 'home',
  dir: __dirname,
  config: {
    browser: {
      page: {
        createRoutes: './createRoutes',
        path: '/*',
        injectors: './injector',
      },
    },
  },
}];

describe('setupIonSpaRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('adds ion browser pages (paths, routes, and injectors)', () => {
    setupIonSpaRoutes(app);

    // login ion - login path
    expect(render).toHaveBeenCalledWith({
      createRoutes: './createRoutes',
      path: '/login*',
      injectors: [
        './injector',
      ],
    }, 'login', createRoutes, [injector]);
    expect(app.get).toHaveBeenCalledWith('/login*', renderMiddleware);

    // login ion - sign-up path
    expect(render).toHaveBeenCalledWith({
      createRoutes: './createRoutes',
      path: '/sign-up*',
      injectors: [
        './injector',
      ],
    }, 'login', createRoutes, [injector]);
    expect(app.get).toHaveBeenCalledWith('/sign-up*', renderMiddleware);

    // home ion - / path
    expect(render).toHaveBeenCalledWith({
      createRoutes: './createRoutes',
      path: '/*',
      injectors: './injector',
    }, 'home', createRoutes, [injector]);
    expect(app.get).toHaveBeenCalledWith('/*', renderMiddleware);
  });
});

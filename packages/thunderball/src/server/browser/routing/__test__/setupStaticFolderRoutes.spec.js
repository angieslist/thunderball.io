import express from 'express';
import setupStaticFolderRoutes from '../setupStaticFolderRoutes';
import constants from '../../../../constants';

jest.mock('express');
jest.mock('../../../../constants');
jest.mock('../../../logger');
const app = {
  use: jest.fn(),
};
const staticMiddleware = () => { };
express.static.mockReturnValue(staticMiddleware);

describe('setupStaticFolderRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('adds static file middleware with ion configuration', () => {
    constants.APP_IONS = [{
      dir: 'ion_test_dir',
      config: {
        staticDirectories: [{
          dir: './static',
          path: '/test/path',
        }, {
          dir: './static2',
          path: ['/test/path/2', '/test/path/3'],
        }],
      },
    }];
    setupStaticFolderRoutes(app);

    expect(express.static).toHaveBeenCalledWith('build/ion_test_dir/static');
    expect(app.use).toHaveBeenCalledWith('/test/path', staticMiddleware);

    expect(express.static).toHaveBeenCalledWith('build/ion_test_dir/static2');
    expect(app.use).toHaveBeenCalledWith('/test/path/2', staticMiddleware);

    expect(express.static).toHaveBeenCalledWith('build/ion_test_dir/static2');
    expect(app.use).toHaveBeenCalledWith('/test/path/3', staticMiddleware);
  });
});

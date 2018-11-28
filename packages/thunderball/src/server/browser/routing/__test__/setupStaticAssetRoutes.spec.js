import express from 'express';
import setupStaticAssetRoutes from '../setupStaticAssetRoutes';
import constants from '../../../../constants';

jest.mock('express');
jest.mock('../../../../constants');
jest.mock('../../../logger');
const app = {
  use: jest.fn(),
};
const staticMiddleware = () => {};
express.static.mockReturnValue(staticMiddleware);

describe('setupStaticAssetRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('adds static file middleware with defaults', () => {
    setupStaticAssetRoutes(app);
    expect(express.static).toHaveBeenCalledWith('build', { maxAge: '200d' });
    expect(app.use).toHaveBeenCalledWith('/assets/', staticMiddleware);
  });
  it('adds static file middleware with app configuration', () => {
    constants.APP_CONFIG = {
      staticAssets: {
        path: '/app/assets',
        maxAge: '10d',
      },
    };
    setupStaticAssetRoutes(app);
    expect(express.static).toHaveBeenCalledWith('build', { maxAge: '10d' });
    expect(app.use).toHaveBeenCalledWith('/app/assets/', staticMiddleware);
  });
});

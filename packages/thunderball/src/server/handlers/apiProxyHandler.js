import compression from 'compression';
import express from 'express';
import logger from '../logger';
import thunderballMiddleware from '../../thunderballMiddleware';
import apiProxy from './apiProxy';
import constants from '../../constants';

const app = express();
app.use(thunderballMiddleware);
app.use(compression());

// Determine api proxy routes
((constants.APP_CONFIG || {}).proxyRoutes || []).forEach((proxyRoute) => {
  app.use(
    `/${proxyRoute.path}`,
    apiProxy(proxyRoute.proxyUrl, proxyRoute.includeBase ? proxyRoute.path : ''));
});

export default app;

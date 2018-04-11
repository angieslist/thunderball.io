import apiProxy from './apiProxy';
import constants from '../../constants';
import app from '../app';

// Determine api proxy routes
((constants.APP_CONFIG || {}).proxyRoutes || []).forEach((proxyRoute) => {
  app.use(
    `/${proxyRoute.path}`,
    apiProxy(proxyRoute.proxyUrl, proxyRoute.includeBase ? proxyRoute.path : ''));
});

export default app;

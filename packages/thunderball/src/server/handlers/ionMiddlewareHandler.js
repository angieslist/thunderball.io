import compression from 'compression';
import express from 'express';
import logger from '../logger';
import constants from '../../constants';
import path from 'path';
import thunderballMiddleware from '../../thunderballMiddleware';

const app = express();
app.use(thunderballMiddleware);
app.use(compression());

// Apply ion specified middleware
const applyMiddlewares = (constants.APP_IONS || [])
  .filter(ion => !!ion.config.middleware)
  .reduce((prev, ion) => [
    ...prev,
    ...(Array.isArray(ion.config.middleware) ? ion.config.middleware : [ion.config.middleware])
      .map(m => require(path.resolve(constants.APP_IONS_DIR, ion.dir, m))),
  ], []);
logger.info(`Adding ${applyMiddlewares.length} application specific middlewares`);
applyMiddlewares.map((applyMiddleware) => {
  const middleware = applyMiddleware(constants.APP_CONFIG, constants.APP_IONS, app);
  // `applyMiddleware` may attach middleware directly to the `app` or return
  // a middleware function so only call `app.use` if a function is returned
  if (typeof middleware === 'function') {
    app.use(middleware);
  }
});

export default app;

import path from 'path';
import logger from '../logger';
import constants from '../../constants';
import app from '../app';

// Apply ion specified middleware
let applyIonMiddlewares = (constants.APP_IONS || [])
  .filter(ion => !!ion.config.middleware)
  .reduce((prev, ion) => [
    ...prev,
    ...(Array.isArray(ion.config.middleware) ? ion.config.middleware : [ion.config.middleware])
      .map(m => require(path.resolve(constants.APP_IONS_DIR, ion.dir, m))),
  ], []);
applyIonMiddlewares = applyIonMiddlewares.map(x => x.default || x);
logger.info(`Adding ${applyIonMiddlewares.length} application specific middlewares`);
applyIonMiddlewares.map((applyMiddleware) => {
  const middleware = applyMiddleware(constants.APP_CONFIG, constants.APP_IONS, app);
  // `applyMiddleware` may attach middleware directly to the `app` or return
  // a middleware function so only call `app.use` if a function is returned
  if (typeof middleware === 'function') {
    app.use(middleware);
  }
});

export default app;

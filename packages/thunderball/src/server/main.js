import logger from './logger';
import compression from 'compression';
import express from 'express';
import constants from '../constants';
import thunderballMiddleware from '../thunderballMiddleware';
import _ from 'lodash';

const app = express();
app.use(thunderballMiddleware);
app.use(compression());

// Apply ion specified middleware
app.use(require('./handlers/ionMiddlewareHandler'));

// Apply api proxy route middleware
app.use(require('./handlers/apiProxyHandler'));

// Apply browser page middleware
app.use(require('./browser'));

// Apply error middleware
app.use(require('./handlers/errorHandler'));

// If no handler is hit, assume 404
app.use(require('./handlers/notFoundHandler'));

if (!constants.IS_PRODUCTION) {
  // handle all uncaughtExceptions in dev mode;
  // in production, the process should restart
  process.on('uncaughtException', (err) => {
    console.error(err);
  });
}

// Start server
const port = _.get(constants.APP_CONFIG, 'port', 8000);
app.listen(port, () => {
  logger.info(`Server started at port ${port}`);
});

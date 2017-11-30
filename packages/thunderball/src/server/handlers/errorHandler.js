import logger from '../logger';
import constants from '../../constants';

export default function errorHandler(err, req, res, next) {
  const errorDetails = err.stack || err;

  logger.error(errorDetails);

  res.status(500).format({
    json() {
      const errorInfo = { error: err.toString() };
      if (!constants.IS_PRODUCTION) {
        errorInfo.details = errorDetails;
      }

      res.send(errorInfo);
    },

    html() {
      const message = constants.IS_PRODUCTION
        ? '<p>Something went wrong</p>'
        : `<pre>${errorDetails}</pre>`;

      res.send(`<h1>500 Internal server error</h1>\n${message}`);
    },

    default() {
      const message = constants.IS_PRODUCTION
        ? 'Something went wrong'
        : `${errorDetails}`;

      res.send(`500 Internal server error:\n${message}`);
    },
  });
}

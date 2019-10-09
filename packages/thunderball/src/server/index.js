// Note: Do not use 'import's in this file since babel would hoist them before instrumentation
// Bootstrap environment
require('@babel/register');
require('isomorphic-fetch');

const constants = require('../constants');
const _ = require('lodash');
const logger = require('./logger');

// Make sure the environment is set
if (!process.env.NODE_ENV) {
  throw new Error(
    'Environment variable NODE_ENV must be set to development or production.',
  );
}

// Load instrumentation providers
_.get(constants.APP_CONFIG, 'instrumentation.providers', [])
  .filter(provider => typeof provider.onLoad === 'function')
  .forEach(provider => provider.onLoad());

logger.info(`Running as: ${constants.IS_PRODUCTION ? 'Production' : 'Development'}`);
logger.trace(`Loading ions from: ${constants.APP_IONS_DIR}`);

// Configure webpack and start main.js
const webpackAssets = require('../webpack/assets');
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const rootDir = require('path').resolve(constants.ABSOLUTE_BASE);

global.webpackIsomorphicTools = new WebpackIsomorphicTools(webpackAssets)
  .server(rootDir, () => {
    /* eslint global-require: 0 */
    require('./main');
  });

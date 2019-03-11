/* This is the webpack hot reload server used in development mode */
// only use require (not import) so that we can require babel/register first
// since this file is started up in a background node process
require('@babel/register');

const webpack = require('webpack');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');
const express = require('express');
const ip = require('ip');
const makeWebpackConfig = require('./makeConfig');
const constants = require('../constants');

if (process.env.NODE_ENV === 'production') {
  throw new Error('Do not start webpack hot reload server in production environment. You are likely using wrong npm start script');
}

// Determine hot reload server and port
const hotPort = constants.APP_CONFIG.hotReloadPort || 8080;
const hotHost = constants.APP_CONFIG.remoteHotReload
  ? ip.address() // Use dynamic ip for remote hot loading
  : '127.0.0.1';

const app = express();
let webpackConfig = makeWebpackConfig(true, hotPort, hotHost);

// Check if appConfig defines a webpack configuration
if (typeof constants.APP_CONFIG.configureWebPack === 'function') {
  webpackConfig = constants.APP_CONFIG.configureWebPack(webpackConfig);
}

const compiler = webpack(webpackConfig);

app.use(webpackDev(compiler, {
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));

app.use(webpackHot(compiler));

app.listen(hotPort, () => {
  /* eslint no-console:0 */
  console.log(`Hot server started at: ${hotHost}:${hotPort}`);
});

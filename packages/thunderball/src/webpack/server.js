/* This is the webpack hot reload server used in development mode */
import webpack from 'webpack';
import webpackDev from 'webpack-dev-middleware';
import webpackHot from 'webpack-hot-middleware';
import makeWebpackConfig from './makeConfig';
import thunderballMiddleware from '../thunderballMiddleware';
import express from 'express';
import constants from '../constants';
import ip from 'ip';
import _ from 'lodash';

if (process.env.NODE_ENV === 'production') {
  throw new Error('Do not start webpack hot reload server in production environment. You are likely using wrong npm start script');
}

// Determine hot reload server and port
const hotPort = constants.APP_CONFIG.hotReloadPort || 8080;
const hotHost = constants.APP_CONFIG.remoteHotReload
  ? ip.address() // Use dynamic ip for remote hot loading
  : '127.0.0.1';

const app = express();
app.use(thunderballMiddleware);
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

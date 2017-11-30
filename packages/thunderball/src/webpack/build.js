/* This is the webpack build used in production mode */
import gutil from 'gulp-util';
import makeWebpackConfig from './makeConfig';
import webpack from 'webpack';
import fs from 'fs';
import constants from '../constants';

export default function build(callback) {
  let webpackConfig = makeWebpackConfig(false);

  // Check if appConfig defines a webpack configuration
  if (typeof constants.APP_CONFIG.configureWebPack === 'function') {
    webpackConfig = constants.APP_CONFIG.configureWebPack(webpackConfig);
  }

  webpack(webpackConfig, (fatalError, stats) => {
    const jsonStats = stats.toJson('verbose');
    const buildError = fatalError || jsonStats.errors[0] || jsonStats.warnings[0];

    // Can save jsonStats to be analyzed with github.com/robertknight/webpack-bundle-size-analyzer.
    fs.writeFileSync('./bundle-stats.json', JSON.stringify(jsonStats));

    if (buildError) {
      throw new gutil.PluginError('webpack', buildError);
    }

    gutil.log('[webpack]', stats.toString({
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false,
    }));

    callback();
  });
}

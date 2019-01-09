import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
import Visualizer from 'webpack-visualizer-plugin';
import _ from 'lodash';
import webpackIsomorphicAssets from './assets';
import constants from '../constants';
import getIndexFileText from './getIndexFileText';
import getStylesLoaders from './getStylesLoaders';

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicAssets);

// No need to trace webpack deprecations since we are authoring a webpack loader or plugin
process.traceDeprecation = false;

export default function makeConfig(isDevelopment, hotPort, hotHost) {
  // Determine root pages
  const pages = {};
  const pagePrereqs = ['babel-polyfill'];
  (constants.APP_IONS || [])
    // Filter only to ions that define a browser page
    .filter(ion => _.get(ion, 'config.browser.page'))
    .forEach((ion) => {
      const pageConfig = ion.config.browser.page;
      const indexPage = path.join(constants.APP_IONS_DIR, ion.dir, 'index.generated.js');

      // Create generated index page for webpack to build from
      fs.writeFileSync(indexPage,
        getIndexFileText(
          pageConfig.createRoutes,
          _.get(constants.APP_CONFIG, 'i18n'),
          pageConfig.injectors,
          pageConfig.props,
        ),
      );

      pages[ion.config.name] =
        (isDevelopment) ? [
          ...pagePrereqs, `webpack-hot-middleware/client?path=http://${hotHost}:${hotPort}/__webpack_hmr`,
          indexPage,
        ] : [
          ...pagePrereqs, indexPage,
        ];
    });

  // Create webpack config
  const staticRoute = (`${_.get(constants.APP_CONFIG, 'staticAssets.path', '/assets/')}/`).replace('//', '/');
  const config = {
    cache: isDevelopment,
    devtool: isDevelopment ? 'eval-source-map' : '',
    entry: pages,
    module: {
      rules: [
        {
          loader: 'url-loader',
          test: /\.(gif|jpg|png|svg)(\?.*)?$/,
          options: {
            limit: 10000, // max size of image to inline
          },
        }, {
          // this is to read fonts directly from the node modules
          loader: 'file-loader',
          test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        }, {
          loader: 'url-loader',
          test: /favicon\.ico$/,
          options: {
            limit: 1, // only 1 favicon
          },
        }, {
          test: /\.jsx?$/,
          include: constants.SRC_DIR,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            plugins: ['transform-runtime', 'add-module-exports', 'lodash'],
            presets: [['es2015'], 'react', 'stage-0'],
            env: {
              development: {
                plugins: [
                  'jsx-control-statements',
                ],
              },
              production: {
                plugins: [
                  'jsx-control-statements',
                  'transform-react-constant-elements',
                  'transform-react-inline-elements',
                ],
              },
            },
          },
        },
        ...getStylesLoaders(isDevelopment),
      ],
    },
    output: isDevelopment ? {
      path: constants.BUILD_DIR,
      filename: '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: `http://${hotHost}:${hotPort}/build/`,
    } : {
      path: constants.BUILD_DIR,
      filename: '[name]-[hash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: staticRoute,
    },
    plugins: (() => {
      const plugins = [
        new webpack.LoaderOptionsPlugin({
          debug: isDevelopment,
          minimize: !isDevelopment,
          hotPort,
          options: {
            postcss: () => (isDevelopment ? [] : [autoprefixer({ browsers: 'last 2 version' })]),
          },
        }),
        new webpack.DefinePlugin({
          'process.env': {
            IS_BROWSER: true, // Because webpack is used only for browser code.
            NODE_ENV: JSON.stringify(isDevelopment ? 'development' : 'production'),
          },
        }),
        new webpack.optimize.CommonsChunkPlugin({
          filename: isDevelopment
            ? `${constants.COMMONS_CHUNK_NAME}.js`
            : `${constants.COMMONS_CHUNK_NAME}-[hash].js`,
          name: constants.COMMONS_CHUNK_NAME,
        }),
      ];
      if (isDevelopment) {
        plugins.push(
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoEmitOnErrorsPlugin(),
          webpackIsomorphicToolsPlugin.development(),
        );
      } else {
        plugins.push(
          // Render styles into separate cacheable file to prevent FOUC and
          // optimize for critical rendering path.
          new ExtractTextPlugin({
            filename: '[name]-[chunkhash].css',
            allChunks: true,
            disable: false,
          }),
          new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
            minimize: true,
            sourceMap: true,
            compress: {
              warnings: false,
              screw_ie8: true,
            },
          }),
          new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
          }),
          webpackIsomorphicToolsPlugin,
          // Create a webpack visualization file to analyze file size
          new Visualizer({
            filename: '../webpack-assets.html',
          }),
        );
      }
      return plugins;
    })(),
    performance: {
      hints: false,
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [
        constants.SRC_DIR,
        'node_modules',
      ],
      alias: {
        __root__: constants.ABSOLUTE_BASE,
        react: path.resolve(constants.NODE_MODULES_DIR, isDevelopment ? 'react/umd/react.development.js' : 'react/umd/react.production.min.js'),
        'react-dom': path.resolve(constants.NODE_MODULES_DIR, isDevelopment ? 'react-dom/umd/react-dom.development.js' : 'react-dom/umd/react-dom.production.min.js'),
      },
    },
  };

  return config;
}

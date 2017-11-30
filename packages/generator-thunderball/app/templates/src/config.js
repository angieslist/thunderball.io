const packageJson = require('../package.json');

module.exports = {
  appVersion: packageJson.version,
  appName: packageJson.name,
  port: process.env.PORT || 8000,
  hotReloadPort: process.env.HOT_RELOAD_PORT || 8080,
  ionsDir: '/src/ions',
  staticAssets: {
    route: '/static',
    maxAge: '200d',
  },
  configureWebPack: config =>
    // Configure default webpack configuration?
    config,
  configureLogger: config =>
    // Configure default logging configuration?
    config,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  proxyRoutes: [
    // Add proxy routes here such as:
    // { path: 'api/twitter', proxyUrl: 'https://api.twitter.com/' }
  ],
  clientConfigKeys: [
    'appVersion', 'appName',
  ],
};

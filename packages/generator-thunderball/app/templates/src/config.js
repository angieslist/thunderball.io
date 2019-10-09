import packageJson from '../package.json';

const port = process.env.PORT || 8000;

export default {
  appVersion: packageJson.version,
  appName: packageJson.name,
  port,
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
  proxyRoutes: [{
    path: 'todos-api',
    proxyUrl: `http://127.0.0.1:${port}/api`,
  }],
  clientConfigKeys: [
    'appVersion', 'appName',
  ],
};

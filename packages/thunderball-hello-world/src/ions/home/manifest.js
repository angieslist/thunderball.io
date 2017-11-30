module.exports = {
  name: 'home',
  browser: {
    page: {
      createRoutes: './browser/createRoutes',
      path: '/*',
      injectors: [
        '../../appInjectors',
      ],
    },
  },
};

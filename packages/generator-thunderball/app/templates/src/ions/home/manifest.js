module.exports = {
  name: 'home',
  browser: {
    page: {
      createRoutes: './createRoutes',
      path: '/*',
      injectors: [
        '../../appInjectors',
      ],
    },
  },
};

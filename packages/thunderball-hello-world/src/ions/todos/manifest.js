const basePath = '/todos';

export default {
  name: 'todos',
  browser: {
    page: {
      createRoutes: './createRoutes',
      path: `${basePath}*`,
      injectors: [
        '../../appInjectors',
        './injectors',
      ],
      props: {
        basePath,
      },
    },
  },
};

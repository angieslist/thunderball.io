const basePath = '/todo-answers';

export default {
  name: 'todos-answers',
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
  middleware: './api/middleware',
};

import createRoutes from './createRoutes';

it('defines routes', () => {
  expect(createRoutes()).toMatchSnapshot();
});


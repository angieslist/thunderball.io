import injectors from './injectors';

test('is a properly formatted injectors object', () => {
  expect(injectors).toMatchSnapshot();
});

test('beforeConfigureStore registers reducers', () => {
  const options = {};
  expect(injectors.beforeConfigureStore(options)).toMatchSnapshot();
});

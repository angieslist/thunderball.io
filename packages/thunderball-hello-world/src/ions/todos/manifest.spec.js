import manifest from './manifest';

test('is a properly formatted manifest object', () => {
  expect(manifest).toMatchSnapshot();
});

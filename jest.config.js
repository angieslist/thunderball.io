module.exports = {
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'empty/object',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  snapshotSerializers: [
    'enzyme-to-json/serializer',
    'jest-serializer-html',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'jest.setup.js',
    '/lib/',
    '/__test__/',
    '/thunderball-hello-world/',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/docs/',
    '/lib/',
    '/templates/',
    '/test-e2e/',
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testURL: 'http://localhost/',
};

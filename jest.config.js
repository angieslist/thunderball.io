module.exports = {
  snapshotSerializers: [
    'jest-serializer-html',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/docs/',
    '/templates/',
    '/test-e2e/',
  ],
};

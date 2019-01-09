module.exports = {
  snapshotSerializers: [
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
  setupTestFrameworkScriptFile: './jest.setup.js',
  testURL: 'http://localhost/',
};

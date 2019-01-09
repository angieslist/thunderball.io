module.exports = {
  name: 'thunderball-e2e',
  globalSetup: './globalSetup',
  snapshotSerializers: [
    'jest-serializer-html',
  ],
  testURL: 'http://localhost/',
};

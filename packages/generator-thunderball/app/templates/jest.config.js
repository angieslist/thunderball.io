module.exports = {
  testURL: 'http://localhost',
  setupFilesAfterEnv: ['./jest.setup.js'],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'empty/object',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
};

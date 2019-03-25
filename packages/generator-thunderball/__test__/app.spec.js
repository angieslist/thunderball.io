const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-thunderball(:app)', () => {
  beforeAll(() => helpers.run(path.join(__dirname, '../app'))
    .withPrompts({
      displayName: 'test app',
      name: 'test-app',
      description: 'Thunderball test app'
    }));

  it('copies normal files', () => {
    assert.file([
      'package.json'
    ]);
  });

  it('copies hidden files', () => {
    assert.file([
      '.eslintrc.js'
    ]);
  });

  it('copies non-text files', () => {
    assert.file([
      'favicon.png'
    ]);
  });

  it('copies normal files in directories', () => {
    assert.file([
      'src/app/containers/app.scss'
    ]);
  });

  it('renders templates properly', () => {
    assert.fileContent([
      ['package.json', /"name": "test-app"/]
    ]);
  });
});

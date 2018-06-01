const version = require('./version');

const branch = 'feature/someCool-Feature_Branch';
const buildNumber = '452';
const lernaData = {
  version: '29.4.2',
};

describe('version', () => {
  beforeEach(() => {
    process.env.CIRCLE_BRANCH = branch;
    process.env.CIRCLE_BUILD_NUM = buildNumber;
  });
  afterEach(() => {
    delete process.env.CIRCLE_BRANCH;
    delete process.env.CIRCLE_BUILD_NUM;
  });

  it('gets the latest version', () => {
    expect(version.getLatestVersion(lernaData.version)).toEqual('29.4.2');
  });

  it('gets the minor version', () => {
    expect(version.getMinorVersion(lernaData.version)).toEqual('29.4');
  });

  it('gets the latest version by build', () => {
    expect(version.getLatestVersionByBuild({ version: lernaData.version })).toEqual('29.4.452');
  });

  it('gets the canary version by build', () => {
    expect(version.getCanaryVersionByBuild({ version: lernaData.version })).toEqual('29.4.2-FEATURE-SOMECOOL-FEATURE-BRANCH-SNAPSHOT.452');
  });
});

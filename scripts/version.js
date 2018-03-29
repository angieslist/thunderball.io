/**
 * Utility functions for determining the version for a release based on the version from lerna.json,
 * Git branch name, and CircleCI build number
 */
const repoLernaData = require('../lerna');

function getLatestVersion(version = repoLernaData.version) {
  return version;
}

function getMinorVersion(version = repoLernaData.version) {
  const versionParts = version.split('.');
  return `${versionParts[0]}.${versionParts[1]}`;
}

function getLatestVersionByBuild({
  buildNumber = process.env.CIRCLE_BUILD_NUM,
  version = repoLernaData.version,
} = {}) {
  return `${getMinorVersion(version)}.${buildNumber}`;
}

function getCanaryVersionByBuild({
  branch = process.env.CIRCLE_BRANCH,
  buildNumber = process.env.CIRCLE_BUILD_NUM,
  version = repoLernaData.version,
} = {}) {
  return `${version}-${branch.toUpperCase().replace(/[^A-Z0-9]/g, '-')}-SNAPSHOT.${buildNumber}`;
}

module.exports = {
  getLatestVersion,
  getMinorVersion,
  getLatestVersionByBuild,
  getCanaryVersionByBuild,
};

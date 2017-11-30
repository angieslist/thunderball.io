import path from 'path';
import _ from 'lodash';
import ionLoader from './ionLoader';

const ABSOLUTE_BASE = process.cwd();
const SRC_DIR = path.join(ABSOLUTE_BASE, 'src');
let APP_CONFIG = {};
try {
  APP_CONFIG = require(`${SRC_DIR}/config`);
} catch (e) {
  // ignore just use empty config
  console.log('Could not load config from: "src/config.js", using empty configuration...');
}
const APP_IONS_DIR = path.join(
  ABSOLUTE_BASE,
  _.get(APP_CONFIG, 'ionsDir') || _.get(APP_CONFIG, 'modulesDir') || 'src/ions');

module.exports = Object.freeze({
  ABSOLUTE_BASE,
  IS_PRODUCTION: ['production', 'prod'].indexOf((process.env.NODE_ENV || '')) > -1,
  NODE_MODULES_DIR: path.join(ABSOLUTE_BASE, 'node_modules'),
  BUILD_DIR: path.join(ABSOLUTE_BASE, 'build'),
  SRC_DIR,
  COMMONS_CHUNK_NAME: 'commons',
  // eslint-disable-next-line no-undef
  IS_REACT_NATIVE: typeof navigator === 'object' && navigator.product === 'ReactNative',
  APP_CONFIG,
  APP_IONS_DIR,
  APP_IONS: ionLoader.load(APP_IONS_DIR, 'manifest.js'),
});

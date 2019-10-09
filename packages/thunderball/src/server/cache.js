import Redis from 'ioredis';
import _ from 'lodash';
import { promisify } from 'util';
import NodeCache from 'node-cache';
import constants from '../constants';

const MEMOIZE_MAX_AGE = _.get(constants.APP_CONFIG, 'ssr.caching.memoizeMaxAge', 3600000);
const cacheType = constants.IS_PRODUCTION ? _.get(constants.APP_CONFIG, 'ssr.caching.cacheType', 'inMemory') : 'inMemory';

const nodeCache = new NodeCache({ stdTTL: MEMOIZE_MAX_AGE / 1000 });
const promisifiedHtmlCacheGet = promisify(nodeCache.get);
const promisifiedHtmlCacheSet = promisify(nodeCache.set);

const redisHost = _.get(constants.APP_CONFIG, 'redisHost');
const redisPort = _.get(constants.APP_CONFIG, 'redisPort', 6379);

const redisClientInstanceAndMethods = cacheType === 'redis' ? new Redis({ host: redisHost, port: redisPort }) : undefined;


const get = key =>
  // use inMemory for local dev
  // if the app fails to supply redis creds but wants to use redis caching fallsback to in-memory
  (redisClientInstanceAndMethods ?
    redisClientInstanceAndMethods.get(key) : promisifiedHtmlCacheGet(key))
;

const set = (key, value) =>
  // use inMemory for local dev
  // if the app fails to supply redis creds but wants to use redis caching fallsback to in-memory
  (redisClientInstanceAndMethods ? redisClientInstanceAndMethods.set(key, value, 'PX', MEMOIZE_MAX_AGE) : promisifiedHtmlCacheSet(key, value))
;

export { get, set };

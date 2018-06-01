import _ from 'lodash';
import memoize from 'memoizee';
import constants from '../../../../constants';

const MEMOIZE_MAX_AGE = _.get(constants.APP_CONFIG, 'ssr.caching.memoizeMaxAge', 3600000);

// Determine what configuration keys should be passed down to the client
export const getClientConfig = appConfig => (appConfig.clientConfigKeys || []).reduce(
  (prev, key) => ({ ...prev, ...{ [key]: _.get(appConfig, key) } }),
  {});
const memoizedGetClientConfig = memoize(getClientConfig,
  { maxAge: MEMOIZE_MAX_AGE, preFetch: true, primitive: true });

export default (ssr = {}, req, shouldMemoize, appConfig = constants.APP_CONFIG) => {
  const defaultInitialState = {
    config: (shouldMemoize ? memoizedGetClientConfig : getClientConfig)(appConfig),
    device: {
      host: `${req.headers['x-forwarded-proto'] || req.protocol}://${req.headers.host}`,
    },
  };

  // Check for getInitialState in app config and ion manifest
  const promises = [_.get(appConfig, 'ssr.getInitialState'), _.get(ssr, 'getInitialState')].map(fn => ((typeof fn === 'function') ? fn(req, appConfig) : undefined));

  return Promise.all(promises)
    .then(results =>
      // If we have a custom getInitialState method then call and merge its results with our
      // initial config
      results.reduce((prev, result) => ({ ...prev, ...result }), defaultInitialState),
    );
};

import React from 'react';
import logger from '../../../logger';
import constants from '../../../../constants';
import { createMemoryHistory, match } from 'react-router';
import url from 'url';
import _ from 'lodash';
import memoize from 'memoizee';

const MEMOIZE_MAX_AGE = _.get(constants.APP_CONFIG, 'ssr.caching.memoizeMaxAge', 3600000);

import getInitialState from './getInitialState';
import getStoreAndRoutes from 'thunderball-client/lib/render/getStoreAndRoutes';
import getPageRenderer from './getPageRenderer';
import notFoundHandler from '../../../handlers/notFoundHandler';

const { setCacheStrategy } = require('rapscallion');

// This is running on the server, do not allow arbitrary ajax requests.
import '../../../noBlindFetchOnServer';

// Determine if a rapscallion cache strategy was defined in config.js
const getCacheStrategy = _.get(constants.APP_CONFIG, 'ssr.caching.getCacheStrategy');
if (typeof getCacheStrategy === 'function') {
  setCacheStrategy(getCacheStrategy());
}

const instrumentationProviders = _.get(constants.APP_CONFIG, 'instrumentation.providers', [])
  .filter(provider => typeof provider.createTracer === 'function');

// Memoize on full url
const memoziedCreateMemoryHistory = memoize(createMemoryHistory,
  { maxAge: MEMOIZE_MAX_AGE });
// Memoize on cacheKey
const memoizedGetStoreAndRoutes = memoize(getStoreAndRoutes,
  { maxAge: MEMOIZE_MAX_AGE, normalizer: args => args[6] });

/* eslint max-params: 0 */
const getData = (initialState, createRoutes, injectors, pageProps, shouldMemoize, cacheKey, originalUrl) => {
  let memoryHistory;
  let result = {};

  instrumentationProviders.reduce(
    (aggregateVal, provider) => provider.createTracer('thunderball:createHistory', aggregateVal),
    () => {
      memoryHistory = (shouldMemoize ? memoziedCreateMemoryHistory : createMemoryHistory)(originalUrl);
    },
  )();

  instrumentationProviders.reduce(
    (aggregateVal, provider) => provider.createTracer('thunderball:getStoreAndRoutes', aggregateVal),
    () => {
      result = (cacheKey && shouldMemoize ? memoizedGetStoreAndRoutes : getStoreAndRoutes)(
        initialState, createRoutes, memoryHistory, undefined, injectors, pageProps, cacheKey);
    },
  )();

  return result;
};

const getSsrConfig = (pageConfig = {}, appConfig = constants.APP_CONFIG) => {
  const ssrConfig = { ...(appConfig.ssr || {}), ...(pageConfig.ssr || {}) };
  ssrConfig.caching = { ...(_.get(appConfig, 'ssr.caching') || {}), ...(_.get(pageConfig, 'ssr.caching') || {}) };
  return ssrConfig;
};

const render = (page, name, createRoutes, injectors = []) => {
  // WARNING: This is the server side version of the page rendering,
  // see thunderball-client/common/pageBuilder for the client side version.
  // These need to remain somewhat the same.

  const ssrConfig = getSsrConfig();

  return (req, res, next) => {
    const hrstart = process.hrtime();
    const shouldMemoize = constants.IS_PRODUCTION && (_.get(ssrConfig, 'caching.memoize', true) !== false);

    // Get initial state redux stores
    getInitialState(page.ssr, req, shouldMemoize)
      // Then render the page
      .then((initialState) => {
        const pathName = url.parse(req.url).pathname;
        // Determine cacheKey to use or default to pathName, cacheKey function could return undefined
        const cacheKey = _.get(ssrConfig, 'caching.getCacheKey', () => pathName)(req);

        // Get store and routes for the page
        const { store, routes, history } = getData(
          initialState, createRoutes, injectors, page.props, shouldMemoize, cacheKey, req.originalUrl);

          // Match the route based on the requested url
          /* eslint no-param-reassign: 0 */
        match({ history, routes, location: req.url },
          (error, redirectLocation, renderProps) => {
            const generate = () => {
              // 3xx Handle redirects
              if (redirectLocation) {
                res.redirect(301, redirectLocation.pathname + redirectLocation.search);
                return;
              }

              // 5xx Handle Errors
              if (error) {
                next(error);
                return;
              }

              // 4xx Handle not found
              if (!renderProps) {
                notFoundHandler(req, res);
                return;
              }

              // 2xx Handle page
              try {
                // TODO: Better handle 404 in a global manner
                res.statusCode = renderProps.routes
                  .some(route => route.path === '*') ? 404 : 200;

                if (res.statusCode === 200) {
                  // set any app or manifest specific headers
                  const customHeaders = {
                    ..._.get(constants.APP_CONFIG, 'ssr.headers', {}),
                    ..._.get(page, 'ssr.headers', {}),
                  };
                  _.forOwn(customHeaders, (value, key) => {
                    res.setHeader(key, value);
                  });
                }

                if (constants.IS_PRODUCTION) {
                  // CacheKey is part of rapscallion and causes the jsx tree or substree to be cached
                  renderProps.cacheKey = cacheKey;
                }

                // TODO: We could memoize all code to the 'catch' statement in a function using 'cacheKey' as the memoize key
                // this would effectively cache the entire html string so we can then res.send(html) the memoized html string
                // We would remove the toStream option if we did this as it would be unnecessary
                const pageRenderer = getPageRenderer(store, renderProps, req, page, name, cacheKey, ssrConfig);

                if (!_.get(ssrConfig, 'useStreaming')) {
                  pageRenderer.toPromise()
                    .then((html) => {
                      res.send(html);
                    }).catch((e) => {
                      next(e);
                    });
                } else {
                  pageRenderer.toStream()
                    .pipe(res);
                }
              } catch (e) {
                next(e);
                return;
              }

              // Record page end time
              const endTime = process.hrtime(hrstart)[1] / 1000000;
              logger.trace(`Render url '${pathName}': ${endTime}ms`);
            };

            // Set composedFunc to the 'generate' method, then for every provider we compose around
            // 'generate' the new function from the provider.  So in the end it calls all providers
            // and the original function.
            // So if there were 3 providers it would call: provider3 -> provider2 -> provider1 -> generate
            instrumentationProviders.reduce(
              (aggregateVal, provider) => provider.createTracer('thunderball:renderPage', aggregateVal),
              generate,
            )();
          },
        );
      })
      .catch((err) => {
        next(JSON.stringify(err));
      });
  };
};

export default render;

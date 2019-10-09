import { createMemoryHistory, match } from 'react-router';
import url from 'url';
import _ from 'lodash';
import memoize from 'memoizee';
import getStoreAndRoutes from 'thunderball-client/lib/render/getStoreAndRoutes';
import { Stream } from 'stream';
import logger from '../../../logger';
import constants from '../../../../constants';
import reduxSsrActionMiddleware from './reduxSsrActionMiddleware';
import getInitialState from './getInitialState';
import getPageRenderer from './getPageRenderer';
import notFoundHandler from '../../../handlers/notFoundHandler';
import { get, set } from '../../../cache';
// This is running on the server, do not allow arbitrary ajax requests.
import '../../../noBlindFetchOnServer';

const MEMOIZE_MAX_AGE = _.get(constants.APP_CONFIG, 'ssr.caching.memoizeMaxAge', 3600000);

const createCacheStream = (cacheKey, setHtmlCache, status) => {
  const bufferedChunks = [Buffer.from(status.toString(), 'utf-8')];
  return new Stream.Transform({
    transform(data, enc, cb) {
      bufferedChunks.push(data);
      cb(null, data);
    },
    flush(cb) {
      setHtmlCache(cacheKey, Buffer.concat(bufferedChunks));
      cb();
    },
  });
};

const formatCacheValue = ({ html, statusCode = '200' }) => `${statusCode}${html}`;

const parseCacheValue = (value) => {
  if (value.length < 4) {
    throw new Error('Invalid cache value');
  }
  return {
    html: value.slice(3),
    statusCode: value.slice(0, 3),
  };
};

const sendResponse = ({ pageRendererArgs, res, shouldStream, statusCode }) => {
  const pageRenderer = getPageRenderer({ ...pageRendererArgs });
  if (!shouldStream) {
    const html = pageRenderer.getHtml();
    const htmlWithDocType = `<!DOCTYPE html>${html}`;
    set(pageRendererArgs.reactRendererCacheKey, formatCacheValue({ html: htmlWithDocType }));
    res.send(htmlWithDocType);
  } else {
    res.write('<!DOCTYPE html>');
    pageRenderer
      .getHtmlStream(createCacheStream(pageRendererArgs.reactRendererCacheKey, set, statusCode))
      .pipe(res);
  }
};

const instrumentationProviders = _.get(constants.APP_CONFIG, 'instrumentation.providers', [])
  .filter(provider => typeof provider.createTracer === 'function');

// Memoize on cacheKey
const memoizedGetStoreAndRoutes = memoize(getStoreAndRoutes,
  { maxAge: MEMOIZE_MAX_AGE, normalizer: args => args[6] });

/* eslint max-params: 0 */
const getData
  = (initialState, createRoutes, injectors, pageProps, shouldMemoize, cacheKey, originalUrl) => {
    let memoryHistory;
    let result = {};

    instrumentationProviders.reduce(
      (aggregateVal, provider) => provider.createTracer('thunderball:createHistory', aggregateVal),
      () => {
        memoryHistory = createMemoryHistory(originalUrl);
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

const getSsrConfig = (pageConfig, appConfig) => {
  const ssrConfig = { ...(appConfig.ssr || {}), ...(pageConfig.ssr || {}) };
  ssrConfig.caching = { ...(_.get(appConfig, 'ssr.caching') || {}), ...(_.get(pageConfig, 'ssr.caching') || {}) };
  return ssrConfig;
};

const render = (page, name, createRoutes, injectors = []) => {
  // WARNING: This is the server side version of the page rendering,
  // see thunderball-client/common/pageBuilder for the client side version.
  // These need to remain somewhat the same.

  const ssrConfig = getSsrConfig(page, constants.APP_CONFIG);

  return (req, res, next) => {
    const hrstart = process.hrtime();
    const shouldMemoize = constants.IS_PRODUCTION && (_.get(ssrConfig, 'caching.memoize', true) !== false);

    // Get initial state redux stores
    getInitialState(page.ssr, req, shouldMemoize)
      // Then render the page
      .then((initialState) => {
        const pathName = url.parse(req.url).pathname;
        // Determine cacheKey to use or
        // default to pathName, cacheKey function could return undefined
        const cacheKey = _.get(ssrConfig, 'caching.getCacheKey', () => pathName)(req);
        const reactRendererCacheKey = _.get(ssrConfig, 'caching.getReactRendererCacheKey', () => pathName)(req);

        // Get store and routes for the page
        const { store, routes, history } = getData(
          initialState, createRoutes, injectors, page.props,
          shouldMemoize, cacheKey, req.originalUrl,
        );

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
                const shouldStream = _.get(ssrConfig, 'useStreaming');

                // note for caching we cache the 3 digit http status and the html
                const renderPage = () => {
                  logger.debug('RenderPage - Cache miss %s on key %s Streaming %s', req.url, reactRendererCacheKey, shouldStream);
                  reduxSsrActionMiddleware(store, renderProps, req, res, reactRendererCacheKey)
                    .then(() => {
                      sendResponse({
                        pageRendererArgs: {
                          store,
                          renderProps,
                          req,
                          page,
                          name,
                          cacheKey,
                          reactRendererCacheKey,
                          ssrConfig,
                          helmetContext: {},
                        },
                        res,
                        shouldStream,
                        statusCode: '200',
                      });
                    })
                    .catch((err) => {
                      const maybeSsrLoadFailFn = renderProps.components.reduce((acc, component) => {
                        const maybeSsrFailFn = _.get(component, 'ssrLoadFail') || _.get(component, 'WrappedComponent.ssrLoadFail');
                        if (maybeSsrFailFn) {
                          return maybeSsrFailFn;
                        }
                        return acc;
                      });
                      if (maybeSsrLoadFailFn) {
                        maybeSsrLoadFailFn({ err, res });
                        sendResponse({
                          pageRendererArgs: {
                            store,
                            renderProps,
                            req,
                            page,
                            name,
                            cacheKey,
                            reactRendererCacheKey,
                            ssrConfig,
                            helmetContext: {},
                          },
                          res,
                          shouldStream,
                          statusCode: res.statusCode,
                        });
                      } else {
                        next(err);
                      }
                    });
                };

                // allow killing of cache
                const configBreakCacheQueryParam = _.get(constants.APP_CONFIG, 'ssr.caching.breakCacheQueryParam');
                const breakCacheQueryParam = _.get(req, `query.${configBreakCacheQueryParam}`, false);
                if (configBreakCacheQueryParam && breakCacheQueryParam) {
                  renderPage();
                } else {
                  get(reactRendererCacheKey)
                    .then((hit) => {
                      if (!hit) {
                        renderPage();
                      } else {
                        logger.debug('RenderPage - Cache hit %s on key %s Streaming %s', req.url, reactRendererCacheKey, shouldStream);
                        // cache hit will look like statusCode<content>
                        const { html, statusCode } = parseCacheValue(hit);
                        res.status(statusCode);
                        res.send(html);
                      }
                    })
                    .catch(() => {
                      renderPage();
                    });
                }
              } catch (err) {
                next(err);
                return;
              }

              // Record page end time
              const endTime = process.hrtime(hrstart)[1] / 1000000;
              logger.trace(`Render url '${pathName}': ${endTime}ms`);
            };

            // Set composedFunc to the 'generate' method, then for every provider we compose around
            // 'generate' the new function from the provider.  So in the end it calls all providers
            // and the original function.
            // So if there were 3 providers it would call:
            // provider3 -> provider2 -> provider1 -> generate
            instrumentationProviders.reduce(
              (aggregateVal, provider) => provider.createTracer('thunderball:renderPage', aggregateVal),
              generate,
            )();
          },
        );
      })
      .catch(next);
  };
};

export default render;

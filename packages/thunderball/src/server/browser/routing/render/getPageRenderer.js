import React from 'react';
import NodeCache from 'node-cache';
import Shell from 'thunderball-client/lib/render/Shell';
import serialize from 'serialize-javascript';
import _ from 'lodash';
import { renderToString, renderToNodeStream } from 'react-dom/server';
import { Stream } from 'stream';
import memoize from 'memoizee';
import constants from '../../../../constants';

const MEMOIZE_MAX_AGE = _.get(constants.APP_CONFIG, 'ssr.caching.memoizeMaxAge', 3600000);

const intlPolyfillFeatures = _.get(constants.APP_CONFIG, 'i18n.locales', [])
  .map(locale => `Intl.~locale.${locale}`)
  .join();

// Default to empty helmet context in case of empty context we still need to render the page
const emptyHelmetContext = {
  htmlAttributes: '',
  bodyAttributes: '',
  title: '',
  base: '',
  meta: '',
  link: '',
  style: '',
  script: '',
  noscript: '',
};

// Allow custom scripts from application config and ion manifest
// If any scripts are a function, execute them, otherwise just display them
const getCustomScripts = (page, scriptType) => [
  ..._.get(constants.APP_CONFIG, `ssr.${scriptType}`, []),
  ..._.get(page, `ssr.${scriptType}`, []),
].map(script => ((typeof script === 'function') ? script() : script))
  .filter(script => !!script); // remove any falsey scripts

export const getHtmlProperties = (page, name, cacheKey, helmetContext) => {
  const helmet = helmetContext.helmet || emptyHelmetContext;
  const { styles, javascript } = webpackIsomorphicTools.assets();

  return {
    htmlAttrs: helmet.htmlAttributes.toString(),
    bodyAttrs: helmet.bodyAttributes.toString(),
    head: [
      helmet.title.toString(),
      helmet.base.toString(),
      helmet.meta.toString(),
      helmet.link.toString(),
      helmet.style.toString(),
      helmet.script.toString(),
      helmet.noscript.toString(),
      // Get the common css file and the css file for the page
      ...[styles.commons, styles[name]].filter(v => !!v).map((v, k) => `<link href='${v}' rel='stylesheet' key='${k}' />`),
    ].join(''),
    scripts: {
      beforeBody: getCustomScripts(page, 'beforeBody'),
      afterBody: [
        ...[
          `<script type="text/javascript" src="https://cdn.polyfill.io/v2/polyfill.min.js?features=${intlPolyfillFeatures}"></script>`,
          javascript.commons ? `<script type="text/javascript" src="${javascript.commons}"></script>` : '',
          `<script type="text/javascript" src="${javascript[name]}"></script>`,
        ],
        ...getCustomScripts(page, 'afterBody'),
      ],
    },
  };
};
const memoizedGetHtmlProperties = memoize(getHtmlProperties,
  { maxAge: MEMOIZE_MAX_AGE, preFetch: true, normalizer: args => args[2] });

const htmlCache = new NodeCache({ stdTTL: MEMOIZE_MAX_AGE / 1000, errorOnMissing: true });

// Node stream that caches data that flows through it.
const createCacheStream = (cacheKey) => {
  const bufferedChunks = [];
  return new Stream.Transform({
    transform(data, enc, cb) {
      bufferedChunks.push(data);
      cb(null, data);
    },
    flush(cb) {
      htmlCache.set(cacheKey, Buffer.concat(bufferedChunks));
      cb();
    },
  });
};

const createShells = (html, state) => ({
  preShell: `<html ${html.htmlAttrs}><head>${html.head}</head><body ${html.bodyAttrs}><script type="text/javascript">window.__INITIAL_STATE__ = ${serialize(state)};</script>${html.scripts.beforeBody.join('')}<div id="app">`,
  postShell: `</div>${html.scripts.afterBody.join('')}</body></html>`,
});

const createCachedRenderer = ({ appShell, cacheKey, helmetContext, getHtmlProps, page, name, state }) => ({
  toPromise: () => {
    try {
      const cachedHtml = htmlCache.get(cacheKey);
      return Promise.resolve(cachedHtml);
    } catch (err) {
      return new Promise((resolve) => {
        const renderedBody = renderToString(appShell);
        const html = getHtmlProps(page, name, cacheKey, helmetContext);
        const shells = createShells(html, state);
        const renderedPage = `${shells.preShell}${renderedBody}${shells.postShell}`;

        htmlCache.set(cacheKey, renderedPage);
        resolve(renderedPage);
      });
    }
  },
  toStream: () => {
    try {
      const cachedHtml = htmlCache.get(cacheKey);
      const passThrough = new Stream.PassThrough();
      passThrough.end(cachedHtml);
      return passThrough;
    } catch (err) {
      const cacheStream = createCacheStream(cacheKey);
      const reactStream = renderToNodeStream(appShell);
      const html = getHtmlProps(page, name, cacheKey, helmetContext);
      const shells = createShells(html, state);

      cacheStream.write(shells.preShell, () => reactStream.pipe(cacheStream, { end: false }));
      reactStream.on('end', () => cacheStream.end(shells.postShell));
      return cacheStream;
    }
  },
});

const getPageRenderer = ({
  store,
  renderProps,
  req,
  page,
  name,
  cacheKey,
  reactRendererCacheKey,
  ssrConfig,
  flushCache = false,
  helmetContext,
}) => {
  if (flushCache) {
    htmlCache.flushAll();
  }

  const state = store.getState();

  // Render the application body only if page.ssr.renderBody is not 'false'
  const appBody = _.get(ssrConfig, 'renderBody', true) !== false ?
    <Shell {...{ store, renderProps, helmetContext }} pageProps={page.pageProps} defaultLocale={_.get(constants.APP_CONFIG, 'i18n.defaultLocale')} />
    : '';

  const shouldMemoize = constants.IS_PRODUCTION && (_.get(ssrConfig, 'caching.memoize', true) !== false);

  // Determine html properties, they can be memoized except for the `state` which could change
  const getHtmlProps = (cacheKey && shouldMemoize ? memoizedGetHtmlProperties : getHtmlProperties);

  if (!constants.IS_PRODUCTION) {
    webpackIsomorphicTools.refresh();
  }

  const cacheKeyStr = `${name}:${JSON.stringify(reactRendererCacheKey)}`;

  return createCachedRenderer({ appShell: appBody, cacheKey: cacheKeyStr, helmetContext, getHtmlProps, page, name, state });
};

export default getPageRenderer;

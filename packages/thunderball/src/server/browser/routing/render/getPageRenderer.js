import React from 'react';
import Helmet from 'react-helmet';
import Shell from 'thunderball-client/lib/render/Shell';
import serialize from 'serialize-javascript';
import _ from 'lodash';
import { render, template } from 'rapscallion';
import memoize from 'memoizee';
import constants from '../../../../constants';

const MEMOIZE_MAX_AGE = _.get(constants.APP_CONFIG, 'ssr.caching.memoizeMaxAge', 3600000);

const intlPolyfillFeatures = _.get(constants.APP_CONFIG, 'i18n.locales', [])
  .map(locale => `Intl.~locale.${locale}`)
  .join();

// Allow custom scripts from application config and ion manifest
// If any scripts are a function, execute them, otherwise just display them
const getCustomScripts = (page: Object, scriptType: String): Array<String> => [
  ..._.get(constants.APP_CONFIG, `ssr.${scriptType}`, []),
  ..._.get(page, 'ssr.${scriptType}', []),
].map(script => ((typeof script === 'function') ? script() : script))
  .filter(script => !!script); // remove any falsey scripts

export const getHtmlProperties = (page, name) => {
  const helmet = Helmet.rewind();
  const { styles, javascript } = webpackIsomorphicTools.assets();

  return {
    htmlAttrs: helmet.htmlAttributes.toString(),
    bodyAttrs: helmet.bodyAttributes ? helmet.bodyAttributes.toString() : '',
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
  { maxAge: MEMOIZE_MAX_AGE, preFetch: true, primitive: true, normalizer: args => args[2] });

/* eslint max-params: 0 */
const getPageRenderer = (store, renderProps, req, page, name, cacheKey, ssrConfig) => {
  const state = store.getState();

  // Render the application body only if page.ssr.renderBody is not 'false'
  const appBody = _.get(ssrConfig, 'renderBody', true) !== false ?
    <Shell {...{ store, renderProps }} pageProps={page.pageProps} defaultLocale={_.get(constants.APP_CONFIG, 'i18n.defaultLocale')} />
    : '';
  const componentRenderer = render(appBody);

  const shouldMemoize = constants.IS_PRODUCTION && (_.get(ssrConfig, 'caching.memoize', true) !== false);

  // Determine html properties, they can be memoized except for the `state` which could change
  const html = (cacheKey && shouldMemoize ? memoizedGetHtmlProperties : getHtmlProperties)(page, name, cacheKey);

  if (!constants.IS_PRODUCTION) {
    webpackIsomorphicTools.refresh();
  }

  // Generate the actual HTML page use helmet components, app css, app js, and the generate body
  // State gets set as __INITIAL_STATE__ before the rest of the beforeBody scripts come in
  return template`<html ${html.htmlAttrs}><head>${html.head}</head><body ${html.bodyAttrs}>${`<script type="text/javascript">window.__INITIAL_STATE__ = ${serialize(state)};</script>`}${html.scripts.beforeBody.join('')}<div id="app">${componentRenderer}</div><script>document.querySelector("#app>[data-reactroot]").setAttribute("data-react-checksum", "${() => componentRenderer.checksum()}")</script>${html.scripts.afterBody.join('')}</body></html>`;
};

export default getPageRenderer;

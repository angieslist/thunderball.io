
// Gets the the 'index.generated.js' file to place in the root of the ion
// This file is used as an entry point for webpack
module.exports = (createRoutes, i18n = {}, injectors = [], props) => {
  let injectorsString = '';
  if (Array.isArray(injectors)) {
    injectorsString = ', [\n';
    injectors
      .filter(injector => typeof injector === 'string' && injector.length > 0)
      .forEach((injector, i) => {
        injectorsString += `      require('${injector}')${i < injectors.length - 1 ? ',' : ''}\n`;
      });
    injectorsString += '    ]';
  } else if (typeof injectors === 'string' && injectors.length > 0) {
    injectorsString = `,
  require('${injectors}')`;
  }
  return `/* generated file - do not modify */
var onWindowIntl = function () {
  require('thunderball-client/lib/render/pageBuilder')(
    require('${createRoutes}')${injectorsString},
    '${i18n.defaultLocale || ''}',
    ${JSON.stringify(props)}
  );

  const { addLocaleData } = require('react-intl');
  [
${(i18n.locales)
    .map(locale => `    require('react-intl/locale-data/${locale}')`)
    .join(',\n')}
  ].forEach((locale) => addLocaleData(locale));
}

var ensureFetch = function (cb) {
  if (typeof fetch === 'undefined') {
    require.ensure([], (require) => {
      require('whatwg-fetch')
      cb()
    })
  } else {
    cb()
  }
}

var ensureIntl = function (cb) {
  if (typeof window.Intl === 'undefined') {
    require.ensure([
      'intl'${(i18n.locales).length > 0 ? ',' : ''}
  ${(i18n.locales)
    .map(locale => `    'intl/locale-data/jsonp/${locale}.js'`)
    .join(',\n')}
    ], (require) => {
      require('intl');
  ${(i18n.locales)
    .map(locale => `    require('intl/locale-data/jsonp/${locale}.js');`)
    .join('\n')}
      cb();
    });
  } else {
    cb()
  }
}

// Check window.Intl, then check window.fetch, then load
ensureIntl(function () {
  ensureFetch(onWindowIntl)
})
`;
};

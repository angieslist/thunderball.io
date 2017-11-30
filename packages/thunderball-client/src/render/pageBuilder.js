import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import Shell from './Shell';
import getStoreAndRoutes from './getStoreAndRoutes';

const render = (Component, props) => {
  ReactDOM.render(
    <Component {...props} />,
    document.getElementById('app'),
  );
};

export default function pageBuilder(createRoutes, injectors = [], defaultLocale, pageProps = {}) {
  // WARNING: This is the client side version of the page rendering,
  // see thunderball/server/browser/render for the server side version.
  // These need to remain somewhat the same.

  // If injectors isn't an array, make it an array with what was passed in
  // This allows for a single injector object
  if (!Array.isArray(injectors)) {
    /* eslint no-param-reassign: 0 */
    injectors = [injectors];
  }

  // Initial state is set isomorphically at first
  const initialState = (typeof window === 'object') ? window.__INITIAL_STATE__ : {};

  const { store, routes, history } = getStoreAndRoutes(
    initialState, createRoutes, browserHistory, { adjustUrlOnReplay: false }, injectors, pageProps);

  const shellProps = { injectors, store, history, pageProps, routes, defaultLocale };

  if (module.hot && typeof module.hot.accept === 'function') {
    module.hot.accept('./Shell', () => {
      const NextShell = require('./Shell');
      render(NextShell, shellProps);
    });
  }

  render(Shell, shellProps);
}

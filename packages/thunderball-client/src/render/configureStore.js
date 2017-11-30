import appReducers from '../reducers/index';
import { createLogger } from 'redux-logger';
import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import handleResetOnAction from './handleResetOnAction';

const isReactNative = typeof navigator === 'object' && navigator.product === 'ReactNative';
const defaultStoreOptions = {
  middleware: [],
  enhancers: [],
  reducers: appReducers,
  initialState: {},
  enableLogger: process.env.NODE_ENV !== 'production' && process.env.IS_BROWSER || isReactNative,
  resetOnAction: [],
};

export default function configureStore(options = {}, injectors = [], pageProps = {}) {
  // Injection point: beforeConfigureStore
  // Using the beforeConfigureStore, determine what the full storeOptions should be
  // by reducing each result of beforeConfigureStore with the previous
  const storeOptions = injectors
    .filter(injector => injector.beforeConfigureStore)
    .reduce((prevOptions, injector) => ({ ...prevOptions, ...injector.beforeConfigureStore(prevOptions, pageProps) }),
      // Create the base storeOptions from the defaults and those defined by the platform
      { ...defaultStoreOptions, ...options });

  // Logger must be the last middleware in chain.
  if (storeOptions.enableLogger) {
    storeOptions.middleware.push(createLogger({
      collapsed: true,
      // Convert objects to pure javascript
      stateTransformer: state => JSON.parse(JSON.stringify(state)),
    }));
  }

  // Add middleware as the first enhancer
  storeOptions.enhancers.unshift(applyMiddleware(...storeOptions.middleware));

  // Always push reduxDevTools to the end of the enhancer stack
  // This is only active in development mode and in clients with the devtools installed
  // Redux tools extension https://github.com/zalmoxisus/redux-devtools-extension
  if (process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' && typeof window.devToolsExtension === 'function') {
    storeOptions.enhancers.push(window.devToolsExtension());
  }

  // Combine reducers and create store
  const combinedReducer = combineReducers(storeOptions.reducers);
  const store = createStore(
    handleResetOnAction(combinedReducer, storeOptions.initialState, storeOptions.resetOnAction),
    storeOptions.initialState,
    compose(...storeOptions.enhancers),
  );

  // Injection point: afterConfigureStore
  injectors
    .filter(injector => injector.afterConfigureStore)
    .forEach(injector => injector.afterConfigureStore(store, pageProps, storeOptions));

  return store;
}

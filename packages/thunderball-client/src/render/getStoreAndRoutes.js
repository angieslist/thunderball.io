import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import configureStore from './configureStore';

/* eslint max-params: 0 */ // this is ok for internal methods
export default function getStoreAndRoutes(
  initialState, createRoutes, historyType, historySyncOptions, injectors = [], pageProps = {}) {
  // Injection point: beforePageMounted
  injectors
    .filter(injector => injector.beforePageMounted)
    .forEach(injector => injector.beforePageMounted(pageProps));

  // Configure store (injectors are called in this function)
  const store = configureStore({
    initialState,
    middleware: [routerMiddleware(historyType)],
  }, injectors, pageProps);

  // Create history by syncing with the redux store
  const history = syncHistoryWithStore(historyType, store, historySyncOptions);

  // Injection point: beforeCreateRoutes
  injectors
    .filter(injector => injector.beforeCreateRoutes)
    .forEach(injector => injector.beforeCreateRoutes(pageProps));

  // Create routes
  const routes = createRoutes(store.getState, store.dispatch);

  // Injection point: afterCreateRoutes
  injectors
    .filter(injector => injector.afterCreateRoutes)
    .forEach(injector => injector.afterCreateRoutes(routes, pageProps));

  return { store, routes, history };
}

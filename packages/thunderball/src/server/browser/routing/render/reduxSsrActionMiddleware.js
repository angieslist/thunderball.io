import { get } from 'lodash';

export default (store, renderProps, req, res) => {
  const { dispatch } = store;
  const actions = renderProps.components.reduce((acc, component) => {
    const ssrLoad = get(component, 'ssrLoad') || get(component, 'WrappedComponent.ssrLoad');
    if (ssrLoad) {
      return [...acc, ...ssrLoad(renderProps, req, { res, dispatch })];
    }
    return acc;
  }, []);
  const promisedActions = actions.map((maybePromise) => {
    if (maybePromise instanceof Promise) {
      return maybePromise;
    }
    return dispatch(maybePromise);
  });
  return Promise.all(promisedActions);
};

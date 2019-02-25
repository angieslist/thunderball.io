import { get } from 'lodash';

export default (store, renderProps, req) => {
  const { dispatch } = store;
  const actions = renderProps.components.reduce((acc, component) => {
    const ssrLoad = get(component, 'ssrLoad') || get(component, 'WrappedComponent.ssrLoad');
    if (ssrLoad) {
      return [...acc, ...ssrLoad(dispatch, renderProps, req)];
    }
    return acc;
  }, []);
  const promises = actions.map(dispatch);
  return Promise.all(promises)
    .then(promiseResults =>
      Promise.all(
        promiseResults.map((promiseResult) => {
          const promiseAdditonalAction = get(promiseResult, 'action');
          if (promiseAdditonalAction) {
            return dispatch(promiseAdditonalAction);
          }
          return Promise.resolve();
        })),
    );
};

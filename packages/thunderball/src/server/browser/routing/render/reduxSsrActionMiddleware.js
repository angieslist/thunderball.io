import { get } from 'lodash';

export default (store, renderProps, req) => {
  const { dispatch } = store;
  const actions = renderProps.components.reduce((acc, component) => {
    const ssrLoad = get(component, 'ssrLoad') || get(component, 'WrappedComponent.ssrLoad');
    if (ssrLoad) {
      return [...acc, ...ssrLoad(renderProps, req)];
    }
    return acc;
  }, []);
  const promisedActions = actions.map(dispatch);
  return Promise.all(promisedActions);
};

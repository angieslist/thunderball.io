import reducers from './reducers';

export default {
  beforeConfigureStore: options => ({
    reducers: {
      ...(options || {}).reducers,
      ...reducers,
    },
  }),
};

import thunk from 'redux-thunk';
import reducers from './reducers';

export default {
  beforeConfigureStore: options => ({
    middleware: [
      ...(options.middleware || []),
      thunk,
    ],
    reducers: {
      ...options.reducers,
      ...reducers,
    },
  }),
};

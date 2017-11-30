import { routerReducer as routing } from 'react-router-redux';
import createGenericReducer from './createGenericReducer';

const reducers = {
  config: createGenericReducer(),
  device: createGenericReducer({
    host: '',
    platform: '',
  }),
  routing,
};

module.exports = reducers;

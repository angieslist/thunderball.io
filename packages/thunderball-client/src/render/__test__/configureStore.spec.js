import { applyMiddleware, createStore, combineReducers } from 'redux';
import configureStore from '../configureStore';

jest.mock('redux');

const initialState = { foo: 'initial' };
const mockedStore = {};
const injector = {
  beforeConfigureStore: jest.fn(),
  afterConfigureStore: jest.fn(),
};
const middleware = () => {};
const pageProps = {
  aPageProp: 'aPagePropValue',
};
const options = {
  middleware: [middleware],
  enhancers: [],
  reducers: [],
  initialState,
  enableLogger: false,
  resetOnAction: [],
};
createStore.mockReturnValue(mockedStore);

describe('configureStore', () => {
  let returnedStore;
  beforeAll(() => {
    returnedStore = configureStore(options, [injector], pageProps);
  });
  it('creates and returns the store', () => {
    expect(createStore).toHaveBeenCalledTimes(1);
    expect(returnedStore).toBe(mockedStore);
  });
  it('combines reducers', () => {
    expect(combineReducers).toHaveBeenCalledWith(options.reducers);
  });
  it('applies middleware options', () => {
    expect(applyMiddleware).toHaveBeenCalledWith(...options.middleware);
  });
  it('calls injector beforeConfigureStore', () => {
    expect(injector.beforeConfigureStore).toHaveBeenCalledWith(options, pageProps);
  });
  it('calls injector afterConfigureStore', () => {
    expect(injector.afterConfigureStore).toHaveBeenCalledWith(mockedStore, pageProps, options);
  });
});

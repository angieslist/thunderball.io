import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from '../configureStore';
import getStoreAndRoutes from '../getStoreAndRoutes';

jest.mock('react-router-redux');
jest.mock('../configureStore');

const initialState = Object.freeze({ foo: 'initial' });
const mockedStore = Object.freeze({
  dispatch: jest.fn(),
  getState: jest.fn(),
});
const mockedRoutes = {};
const mockedHistory = {};
const injector = {
  beforePageMounted: jest.fn(),
  beforeCreateRoutes: jest.fn(),
  afterCreateRoutes: jest.fn(),
};
const pageProps = {
  aPageProp: 'aPagePropValue',
};
const historyType = {};
const historySyncOptions = {};
const createRoutes = () => mockedRoutes;

configureStore.mockReturnValue(mockedStore);
syncHistoryWithStore.mockReturnValue(mockedHistory);

describe('getStoreAndRoutes', () => {
  let returnedStoreAndRoutes;
  beforeAll(() => {
    returnedStoreAndRoutes = getStoreAndRoutes(
      initialState,
      createRoutes,
      historyType,
      historySyncOptions,
      [injector],
      pageProps,
    );
  });
  it('gets store and routes', () => {
    expect(returnedStoreAndRoutes).toEqual({
      store: mockedStore,
      routes: mockedRoutes,
      history: mockedHistory,
    });
  });
  it('calls injector beforePageMounted', () => {
    expect(injector.beforePageMounted).toHaveBeenCalledWith(pageProps);
  });
  it('calls injector beforeCreateRoutes', () => {
    expect(injector.beforeCreateRoutes).toHaveBeenCalledWith(pageProps);
  });
  it('calls injector afterCreateRoutes', () => {
    expect(injector.afterCreateRoutes).toHaveBeenCalledWith(mockedRoutes, pageProps);
  });
});

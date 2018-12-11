import ReactDOM from 'react-dom';
import getStoreAndRoutes from '../getStoreAndRoutes';
import pageBuilder from '../pageBuilder';

jest.mock('react-dom');
jest.mock('../getStoreAndRoutes');

const mockedStore = Object.freeze({
  dispatch: jest.fn(),
  getState: jest.fn(),
  testStore: true,
});
const mockedRoutes = {
  testRoutes: true,
};
const mockedHistory = {
  testHistory: true,
};
const injector = {
  beforePageMounted: jest.fn(),
  beforeCreateRoutes: jest.fn(),
  afterCreateRoutes: jest.fn(),
};
const pageProps = {
  aPageProp: 'aPagePropValue',
};
const createRoutes = () => mockedRoutes;

getStoreAndRoutes.mockReturnValue({
  store: mockedStore,
  routes: mockedRoutes,
  history: mockedHistory,
});

describe('pageBuilder', () => {
  let app;
  beforeEach(() => {
    app = document.createElement('div');
    app.setAttribute('id', 'app');
    document.getElementsByTagName('body').item(0).appendChild(app);
  });
  it('renders Shell with props into div#app', () => {
    pageBuilder(createRoutes, injector, 'en', pageProps);
    expect(ReactDOM.render.mock.calls).toMatchSnapshot();
  });
});

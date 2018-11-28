import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Shell from '../Shell';

jest.mock('react-redux');

const store = Object.freeze({
  dispatch: jest.fn(),
  getState: jest.fn(),
  testStore: true,
});
const pageProps = {
  testPageProps: true,
};
const injector = {
  afterPageMounted: jest.fn(),
};
const injectors = [injector];
const history = {
  testHistory: true,
};
const routes = {
  testRoutes: true,
};
const renderProps = {
  testRenderProps: true,
};

describe('Shell', () => {
  let app;
  beforeEach(() => {
    app = document.createElement('div');
    app.setAttribute('id', 'app');
    document.getElementsByTagName('body').item(0).appendChild(app);
  });
  it('renders ', () => {
    const DATE_TO_USE = new Date('2016');
    global.Date = jest.fn(() => DATE_TO_USE);
    const wrapper = shallow(
      <Shell
        store={store}
        pageProps={pageProps}
        injectors={injectors}
        history={history}
        routes={routes}
        renderProps={renderProps}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('renders in browser', () => {
    process.env.IS_BROWSER = true;
    const DATE_TO_USE = new Date('2016');
    global.Date = jest.fn(() => DATE_TO_USE);
    const wrapper = shallow(
      <Shell
        store={store}
        pageProps={pageProps}
        injectors={injectors}
        history={history}
        routes={routes}
        renderProps={renderProps}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    delete process.env.IS_BROWSER;
  });
  it('calls injector afterPageMounted', () => {
    shallow(
      <Shell
        store={store}
        pageProps={pageProps}
        injectors={injectors}
        history={history}
        routes={routes}
        renderProps={renderProps}
      />,
    );
    expect(injector.afterPageMounted).toHaveBeenCalledWith(store, pageProps);
  });
});

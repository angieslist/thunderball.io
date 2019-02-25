import React from 'react';
import { render } from 'enzyme';
import toJson from 'enzyme-to-json';
import { HelmetProvider } from 'react-helmet-async';
import HomeView from './HomeView';

describe('<HomeView />', () => {
  it('renders', () => {
    const wrapper = render(
      <HelmetProvider>
        <HomeView />
      </HelmetProvider>,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

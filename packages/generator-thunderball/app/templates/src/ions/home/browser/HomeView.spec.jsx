import React from 'react';
import { render } from 'enzyme';
import toJson from 'enzyme-to-json';
import HomeView from './HomeView';

describe('<HomeView />', () => {
  it('renders', () => {
    const wrapper = render(<HomeView />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

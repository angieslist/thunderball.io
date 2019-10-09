import React from 'react';
import { render } from 'enzyme';
// import toJson from 'enzyme-to-json';
import Home from './Home';

describe('<Home />', () => {
  it('renders', () => {
    const wrapper = render(<Home />);
    expect(wrapper).toMatchSnapshot();
  });
});

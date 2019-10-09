import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import TodoView from './TodoView';

const setup = () => {
  const store = configureStore()({});
  const wrapper = shallow(<TodoView filter="SHOW_ALL" store={store} />);

  return {
    store,
    wrapper,
  };
};

describe('TodoView', () => {
  test('renders without crashing', () => {
    const { wrapper } = setup();
    expect(wrapper).toMatchSnapshot();
  });
});

import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import AddTodo from './AddTodo';

const setup = () => {
  const store = configureStore()({ todos: [] });
  const wrapper = shallow(<AddTodo store={store} />);

  return {
    store,
    wrapper,
  };
};

describe('AddTodo', () => {
  test('renders without crashing', () => {
    const { wrapper } = setup();
    expect(wrapper).toMatchSnapshot();
  });

  test('onSubmit calls preventDefault to stop form submit', () => {
    const preventDefault = jest.fn();
    const { wrapper } = setup();
    const form = wrapper.shallow().shallow().find('form');
    form.simulate('submit', { preventDefault });
    expect(preventDefault).toHaveBeenCalled();
  });

  test('onSubmit returns early if input.value is not set', () => {
    const { store } = setup();
    expect(store.getActions()).toEqual([]);
  });

  test('onSubmit dispatches action if input.value is set', () => {
    const { store, wrapper } = setup();
    const preventDefault = jest.fn();
    const deeperWrapper = wrapper.shallow();

    deeperWrapper
      .find('input')
      .simulate('change', { target: { value: 'Test todo' } });

    deeperWrapper.find('form').simulate('submit', { preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(store.getActions()).toMatchObject([{
      id: expect.any(Number),
      text: 'Test todo',
      type: 'ADD_TODO',
    }]);
  });
});

import React from 'react';
import { shallow } from 'enzyme';

import Todo from './Todo';

const setup = (setupProps = {}) => {
  const defaultProps = {
    onClick: jest.fn(),
    id: 123,
    completed: false,
    text: 'Test todo',
  };
  const props = { ...defaultProps, ...setupProps };
  const wrapper = shallow(
    <Todo
      {...props}
    />,
  );

  return {
    props,
    wrapper,
  };
};

describe('Todo', () => {
  test('renders without crashing', () => {
    const { wrapper } = setup();
    expect(wrapper).toMatchSnapshot();
  });

  test('marks as checked when completed', () => {
    const { wrapper } = setup({ completed: true });

    expect(wrapper).toMatchSnapshot();
  });

  test('calls onClick when changed', () => {
    const { props, wrapper } = setup();

    wrapper.find('input').simulate('change');
    expect(props.onClick).toHaveBeenCalled();
  });
});

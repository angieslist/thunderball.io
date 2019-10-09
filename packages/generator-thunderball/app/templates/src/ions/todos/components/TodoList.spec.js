import React from 'react';
import { shallow } from 'enzyme';

import TodoList from './TodoList';

const setup = (setupProps = {}) => {
  const defaultProps = {
    todos: [],
    toggleTodo: jest.fn(),
  };
  const props = { ...defaultProps, ...setupProps };
  const wrapper = shallow(
    <TodoList {...props} />,
  );

  return {
    props,
    wrapper,
  };
};

describe('TodoList', () => {
  test('renders without crashing', () => {
    const { wrapper } = setup();
    expect(wrapper).toMatchSnapshot();
  });

  describe('with todos', () => {
    const { wrapper, props } = setup({
      todos: [
        {
          text: 'Test AddTodo',
          completed: false,
          id: 0,
        },
      ],
    });

    test('renders a list of todos', () => {
      expect(wrapper).toMatchSnapshot();
    });

    test('todo onClick calls toggleTodo', () => {
      wrapper.find('Todo').simulate('click');
      expect(props.toggleTodo).toHaveBeenCalled();
    });
  });
});

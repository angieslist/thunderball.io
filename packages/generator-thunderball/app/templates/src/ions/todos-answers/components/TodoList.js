import React from 'react';
import PropTypes from 'prop-types';
import Todo from './Todo';

const TodoList = ({ todos, toggleTodo }) => (
  <div>
    <If condition={!todos.length}>
      <p>
        No TODOs
      </p>
    </If>
    {todos.map(todo =>
      (<Todo
        key={todo.id}
        {...todo}
        onClick={() => toggleTodo(todo.id)}
      />),
    )}
  </div>
);

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  toggleTodo: PropTypes.func.isRequired,
};

export default TodoList;

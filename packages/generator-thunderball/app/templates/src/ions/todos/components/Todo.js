import React from 'react';
import PropTypes from 'prop-types';

const Todo = ({ onClick, id, completed, text }) => (
  <div>
    <input
      type="checkbox"
      id={`todo-${id}`}
      onChange={onClick}
      checked={completed}
    />
    <label
      className="label-inline"
      htmlFor={`todo-${id}`}
    >
      {text}
    </label>
  </div>
);

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

export default Todo;

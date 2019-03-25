import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addTodo } from '../actions';

function AddTodo({ dispatch }) {
  const [value, setValue] = React.useState('');
  const handleChange = event => setValue(event.target.value);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) {
      return;
    }
    dispatch(addTodo(value));
    setValue('');
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={value} onChange={handleChange} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  );
}

AddTodo.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(AddTodo);

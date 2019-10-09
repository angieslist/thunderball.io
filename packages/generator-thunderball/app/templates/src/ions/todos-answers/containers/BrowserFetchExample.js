import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import { Link } from 'react-router';
import Helmet from 'react-helmet-async';
import TodoList from './TodoList';
import { basePath } from '../constants';
import { fetchAndAddTodos } from '../actions';

function BrowserFetchExample({ fetchTodos }) {
  React.useEffect(() => { fetchTodos(); }, []);
  return (
    <div>
      <Helmet title="Browser Fetch Todos" />
      <div>
        <h1>
          Todos
        </h1>
        <TodoList />
        <hr />
        <Link to={`${basePath}`}>
          Todos
        </Link>
      </div>
    </div>
  );
}

BrowserFetchExample.propTypes = {
  // redux action
  fetchTodos: PropTypes.func.isRequired,
};

export default hot(module)(
  connect(null, {
    fetchTodos: fetchAndAddTodos,
  })(BrowserFetchExample),
);

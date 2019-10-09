import React from 'react';
import { hot } from 'react-hot-loader';
import { Link } from 'react-router';
import Helmet from 'react-helmet-async';
import TodoList from './TodoList';
import { basePath } from '../constants';
import { fetchAndAddTodos } from '../actions';

const ServerFetchExample = () =>
  (
    <div>
      <Helmet title="Server Fetch Todos" />
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

ServerFetchExample.ssrLoad = () => [
  fetchAndAddTodos(),
];

export default hot(module)(ServerFetchExample);

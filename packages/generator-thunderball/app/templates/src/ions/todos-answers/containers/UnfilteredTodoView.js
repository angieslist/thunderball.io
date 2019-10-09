import React from 'react';
import { hot } from 'react-hot-loader';
import { Link } from 'react-router';
import Helmet from 'react-helmet-async';
import TodoList from './TodoList';
import { basePath } from '../constants';

const UnfilteredTodoView = () => (
  <div>
    <Helmet>
      <title>
        Unfiltered TODOs
      </title>
    </Helmet>
    <h1>
      Unfiltered TODOs
    </h1>
    <TodoList />
    <hr />
    <Link to={`${basePath}`}>
      Todos
    </Link>
  </div>
);

export default hot(module)(UnfilteredTodoView);

import React from 'react';
import { FormattedMessage } from 'react-intl';
import Footer from './Footer';
import AddTodo from '../containers/AddTodo';
import VisibleTodoList from '../containers/VisibleTodoList';

const App = () => (
  <div>
    <h1>
      <FormattedMessage
        id="app.title"
        description="app title"
        defaultMessage="TODO"
      />
    </h1>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
    <hr />
    <a href="/">Home</a> {'> Todos'}
  </div>
);

export default App;

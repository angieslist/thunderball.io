import React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from '../../app/containers/App';
import TodoView from './containers/TodoView';
import { basePath } from './constants';
import UnfilteredTodoView from './containers/UnfilteredTodoView';
import ServerFetchExample from './containers/ServerFetchExample';
import BrowserFetchExample from './containers/BrowserFetchExample';

export default function createRoutes(/* getState */) {
  return (
    <Route component={App} path={basePath}>
      <IndexRoute component={TodoView} />
      <Route path="unfiltered" component={UnfilteredTodoView} />
      <Route path="server-fetch-example" component={ServerFetchExample} />
      <Route path="browser-fetch-example" component={BrowserFetchExample} />
    </Route>
  );
}

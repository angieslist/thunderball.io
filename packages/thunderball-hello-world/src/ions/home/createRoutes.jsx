import React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from '../../app/containers/App';
import HomeView from './containers/HomeView';

export default function createRoutes(/* getState */) {
  return (
    <Route component={App} path="/">
      <IndexRoute component={HomeView} />
    </Route>
  );
}

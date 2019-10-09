import React from 'react';
import { hot } from 'react-hot-loader';
import Helmet from 'react-helmet-async';
import Home from '../components/Home';

const HomeView = () => (
  <div>
    <Helmet title="Home" />
    <Home />
  </div>
);

export default hot(module)(HomeView);

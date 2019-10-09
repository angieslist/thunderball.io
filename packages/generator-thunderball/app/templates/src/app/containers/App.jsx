import React from 'react';
import { hot } from 'react-hot-loader';
import Helmet from 'react-helmet-async';
import PropTypes from 'prop-types';
import './app.scss';
import href from '../../../favicon.png';

const App = ({ children }) => (
  <div>
    <Helmet
      htmlAttributes={{
        lang: 'en',
      }}
      titleTemplate={'%s - <%= displayName %>'}
      meta={[]}
      link={[
        { rel: 'shortcut icon', type: 'image/png', href },
        { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic' },
        { rel: 'stylesheet', href: '//cdn.rawgit.com/necolas/normalize.css/master/normalize.css' },
        { rel: 'stylesheet', href: '//cdn.rawgit.com/milligram/milligram/master/dist/milligram.min.css' },
      ]}
    />
    <div className="container">
      <div className="row">
        <div className="column">
          {children}
        </div>
      </div>
    </div>
  </div>
);

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default hot(module)(App);

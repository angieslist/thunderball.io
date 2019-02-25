import React from 'react';
import Helmet from 'react-helmet-async';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import './app.scss';
import href from '../../../favicon.png';

// This must be a 'class' and not a pure render method so that HMR will work
/* eslint react/prefer-stateless-function: 0 */
class App extends React.Component {
  render() {
    const { children } = this.props;

    // TODO: Add a header and/or footer here as well as any other data to be
    // on every Page and View
    return (
      <div>
        <Helmet
          htmlAttributes={{
            lang: 'en',
          }}
          titleTemplate={'%s - <%= displayName %>'}
          meta={[]}
          link={[
            { rel: 'shortcut icon', type: 'image/png', href },
          ]}
        />
        {children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default compose(
  pure,
)(App);

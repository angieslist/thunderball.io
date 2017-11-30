import React from 'react';
import Helmet from 'react-helmet';
import { compose, pure } from 'recompose';
import './home.scss';

// This must be a 'class' and not a pure render method so that HMR will work
/* eslint react/prefer-stateless-function: 0 */
class HomeView extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Thunderball hello world" />
        <h1>Welcome to Thunderball hello world.</h1>
      </div>
    );
  }
}

HomeView.propTypes = {
};

export default compose(
  pure,
)(HomeView);

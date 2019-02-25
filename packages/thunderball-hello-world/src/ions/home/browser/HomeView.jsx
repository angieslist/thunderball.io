import React from 'react';
import Helmet from 'react-helmet-async';
import { compose, pure } from 'recompose';
import './home.scss';

/* This filler text is needed in order to ensure the file size for this page is greater than 1kb.
   We need a page weight > 1kb in order to test gzip compression, since responses with a size less
   than 1kb will not be compressed. */
const fillerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vehicula laoreet sem, eget blandit eros dapibus id. Nam et metus nec elit placerat molestie. Etiam ultricies semper finibus. Maecenas efficitur risus elit. Sed ac felis vulputate, ornare neque ut, tempor dui. Sed efficitur auctor est quis faucibus. Quisque venenatis ornare tempus. Integer odio odio, fringilla vitae urna et, dapibus posuere felis. Aenean tristique semper erat, ac finibus augue pharetra eget. Mauris efficitur turpis vitae ante suscipit molestie.'; // eslint-disable-line max-len

// This must be a 'class' and not a pure render method so that HMR will work
/* eslint react/prefer-stateless-function: 0 */
class HomeView extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Thunderball hello world" />
        <h1>Welcome to Thunderball hello world.</h1>
        <div>{fillerText}</div>
      </div>
    );
  }
}

HomeView.propTypes = {
};

export default compose(
  pure,
)(HomeView);

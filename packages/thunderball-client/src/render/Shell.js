import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, RouterContext } from 'react-router';
import { IntlProvider } from 'react-intl';

// Shell of the body of the document
// This is called by client-side and server-side
class Shell extends React.Component {
  componentDidMount() {
    // Injection point: afterPageMounted
    if (this.props.injectors) {
      this.props.injectors
        .filter(injector => injector.afterPageMounted)
        .forEach(injector => injector.afterPageMounted(this.props.store, this.props.pageProps));
    }
  }

  render() {
    const { store, defaultLocale = 'en' } = this.props;

    return (
      <Provider store={store}>
        <IntlProvider
          defaultLocale={defaultLocale}
          initialNow={new Date()}
          key={defaultLocale} // https://github.com/yahoo/react-intl/issues/234
          locale={defaultLocale}
        >
          {
            process.env.IS_BROWSER ?
              <Router history={this.props.history}>
                {this.props.routes}
              </Router>
              : <RouterContext {...this.props.renderProps} />
          }
        </IntlProvider>
      </Provider>
    );
  }
}

Shell.propTypes = {
  store: PropTypes.object,
  pageProps: PropTypes.object,
  defaultLocale: PropTypes.string,

  // client side render
  injectors: PropTypes.array,
  history: PropTypes.object,
  routes: PropTypes.object,

  // server side render
  renderProps: PropTypes.object,
};

export default Shell;

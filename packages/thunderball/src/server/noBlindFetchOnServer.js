import _ from 'lodash';
import constants from '../constants';

const baseUrl = `http://127.0.0.1:${_.get(constants.APP_CONFIG, 'port', 8000)}`;

/* eslint no-param-reassign: 0 */
global.fetch = (fetch => (...args) => {
  const promise = Promise.resolve(args);

  // Check for 'allowOnServer' property, only these calls will be allowed
  if ((typeof args[1] === 'object' && args[1].allowOnServer) || (typeof args[0] === 'object' && args[0].allowOnServer)) {
    // Register fetch call
    return promise.then(() => {
      // If the request path starts with a '/' then its relative
      // If the first argument is a Request, we cannot change the url, so must be absolute
      if (typeof args[0] === 'string' && args[0][0] === '/') {
        args[0] = `${baseUrl}${args[0]}`;
      }

      return fetch(...args);
    });
  }

  // We are returning an empty Response instead of nothing so that any client side code expecting
  // a Response will still function correctly
  return promise.then(() => new Response());
})(global.fetch);

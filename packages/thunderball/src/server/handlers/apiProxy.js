import logger from '../logger';
import path from 'path';
import _ from 'lodash';
import request from 'request';

export const joinProxyPath = (requestUrl, pathUrl) =>
  // Combine the request url with any pathUrl
  `${(pathUrl && pathUrl !== '/') ? `/${pathUrl}` : ''}${(requestUrl && requestUrl !== '/') ? `/${requestUrl}` : ''}`
    // Remove consecutive slashes
    .replace(/\/+/g, '/')
    // Remove trailing slash before parameters or hash
    .replace(/\/(\?|&|#[^!])/g, '$1')
;

export default (proxyUrl, pathUrl = '') => (req, res, next) => {
  const proxyPath = joinProxyPath(req.url, pathUrl);

  const r = request(`${proxyUrl}${proxyPath}`);

  // If any errors happen in the proxy request, just return a 500 to the client
  r.on('error', (err) => {
    logger.error(`Encountered api proxy exception: ${JSON.stringify(err)}`);
    res.status(500).send({ message: err.code });
  });

  logger.trace(`Proxying request: "${req.method} ${proxyPath}" to "${proxyUrl}${proxyPath}"`);
  req.pipe(r).pipe(res);

  // Make sure proxy requests still get the correct header
  res.setHeader('X-Powered-By', 'Thunderball');
};

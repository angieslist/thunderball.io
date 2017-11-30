import express from 'express';
import logger from '../../logger';
import _ from 'lodash';
import constants from '../../../constants';

export default function setupStaticAssetRoutes(app) {
  const staticRoute = _.get(constants.APP_CONFIG, 'staticAssets.path', '/assets/')
    .replace(/\/?$/, '/'); // ensure ends in /
  const maxAge = _.get(constants.APP_CONFIG, 'staticAssets.maxAge', '200d');
  app.use(staticRoute, express.static('build', { maxAge }));
  logger.info(`Static assets being served at '${staticRoute}' with max age '${maxAge}'`);
}

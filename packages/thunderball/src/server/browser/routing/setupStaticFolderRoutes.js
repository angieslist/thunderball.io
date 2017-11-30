import express from 'express';
import logger from '../../logger';
import _ from 'lodash';
import constants from '../../../constants';

const getPathArray = (routePath) => {
  if (!routePath) {
    return [];
  }

  // Support either an array of paths or a single path
  return Array.isArray(routePath) ? routePath : [routePath];
};

export default function setupStaticFolderRoutes(app) {
  (constants.APP_IONS || [])
    .filter(ion => !_.isEmpty(ion.config.staticDirectories))
    .forEach((ion) => {
      ion.config.staticDirectories.forEach((staticDir) => {
        getPathArray(staticDir.path).forEach((p) => {
          app.use(p, express.static(`build/${ion.dir}/${staticDir.dir.split('/').slice(-1).pop()}`));
          logger.info(`Added static route: "${p}"`);
        });
      });
    });
}

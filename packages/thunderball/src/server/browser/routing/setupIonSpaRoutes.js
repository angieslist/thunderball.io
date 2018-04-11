import path from 'path';
import _ from 'lodash';
import logger from '../../logger';
import render from './render';
import constants from '../../../constants';

/*
* Gets the path from an ion file
* @param  {} ionDirectory='The directory for the ion'
* @param  {} filePath='The file path to be obtained'
*/
const getIonPath = (ionDirectory: String = '', filePath: String = '') =>
  // If it starts with a '.', then its a relative path, otherwise assume it's absolute
  ((filePath && filePath.charAt(0) === '.') ?
    path.join(constants.APP_IONS_DIR, ionDirectory, filePath) :
    filePath)
;

export default function setupStaticFolderRoutes(app) {
  const filteredIons = (constants.APP_IONS || [])
    // Filter to ions that actually have a browser page defined
    .filter(ion => _.get(ion.config, 'browser.page'));

  // Break many ion.config.browser.page.path paths into single path ions
  const singlePathIons = filteredIons.reduce((pathIons, ion) => {
    const maybeManyIonPaths = _.get(ion, 'config.browser.page.path');
    if (_.isArray(maybeManyIonPaths)) {
      const manySinglePathIons = maybeManyIonPaths.map((ionPath) => {
        const singleRouteIon = _.set(
          _.cloneDeep(ion), // Do no mutate original ion object
          'config.browser.page.path',
          ionPath,
        );
        return singleRouteIon;
      });
      return [...pathIons, ...manySinglePathIons];
    } else if (_.isString(maybeManyIonPaths)) {
      return [...pathIons, ion];
    }
    const ionName = _.get(ion, 'config.name', 'ERR: No ion name provided');
    logger.warn(`A routes path was defined for "${ionName}", but it was neither a string path nor array path`);
    return pathIons;
  }, []);

  singlePathIons
    // Sort in reverse order so that longer paths are first and sorted for correct overrides
    .sort((prev, ion) => prev.config.browser.page.path.localeCompare(ion.config.browser.page.path))
    .reverse()
    .forEach((ion) => {
      const page = ion.config.browser.page;
      if (page.createRoutes) {
        if (!page.path) {
          logger.warn(`A routes file was defined for "${page.name}", but no "path" was specified`);
        } else {
          const createRoutes = require(getIonPath(ion.dir, page.createRoutes));

          const injectors = (Array.isArray(page.injectors) ? page.injectors : [page.injectors])
            .filter(injector => typeof injector === 'string' && injector.length > 0)
            .map(injector => require(getIonPath(ion.dir, injector)));

          app.get(
            page.path,
            render(page, ion.name, createRoutes, injectors),
          );
          logger.info(`Added page: "${ion.name}" at "${page.path}"`);
        }
      }
    });
}

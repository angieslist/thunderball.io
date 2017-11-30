import fs from 'fs';
import path from 'path';

module.exports = {
  // Get all folders in the 'ions' folder that contain a manifest file
  // and map them to an object with the path and loaded configuration
  load: (ionsDir, manifestName = 'manifest.js') => {
    if (!ionsDir) {
      throw new Error('No path for ions is specified');
    }

    try {
      return fs.readdirSync(ionsDir)
        .filter(file => fs.statSync(path.join(ionsDir, file)).isDirectory())
        .filter(folder => fs.existsSync(path.join(ionsDir, folder, manifestName)))
        .map((folder) => {
          const ion = {
            dir: folder,
            config: require(path.join(ionsDir, folder, manifestName)) || {},
          };
          // If ion has no 'name', then assume the folder name
          if (!ion.name) {
            ion.name = folder;
          }
          return ion;
        })
      ;
    } catch (e) {
      console.log(`Could not load ion directory: "${ionsDir}", using no ions...`);
      return [];
    }
  },
};

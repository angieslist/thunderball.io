/**
 * Prints the version from lerna.json
 */

/* eslint no-console: "off" */
const fs = require('fs');

const lernaFile = fs.readFileSync('./lerna.json', 'utf8');
const lernaData = JSON.parse(lernaFile);
console.log(lernaData.version);

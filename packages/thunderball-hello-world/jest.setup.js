const Enzyme = require('enzyme');
const EnzymeReactAdapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new EnzymeReactAdapter() });

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';
import constants from './../constants';

const nodeModules = path.resolve(constants.NODE_MODULES_DIR);
const compassMixins = path.resolve(path.join(
  constants.ABSOLUTE_BASE,
  '/node_modules/compass-mixins/lib'),
);
const cssModules = 'modules=true&localIdentName=[name]__[local]___[hash:base64:5]';

// Allow any loader to directly pull from the node_modules folder using imports such as
// @import 'my-node-library/my-styles.scss'
const loaders = {
  css: `?${cssModules}`,
  less: `!less-loader?${cssModules}&includePaths[]=${nodeModules}`,
  scss: `!sass-loader?${cssModules}&includePaths[]=${compassMixins}&includePaths[]=${nodeModules}`,
  sass: `!sass-loader?${cssModules}&indentedSyntax&includePaths[]=${compassMixins}&includePaths[]=${nodeModules}`,
  styl: `!stylus-loader?${cssModules}&includePaths[]=${nodeModules}`,
};

export default isDevelopment => Object.keys(loaders).map((ext) => {
  const prefix = 'css-loader!postcss-loader';
  const extLoaders = prefix + loaders[ext];
  const loader = isDevelopment
    ? `style-loader!${extLoaders}`
    : ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: extLoaders,
    });
  return {
    loader,
    test: new RegExp(`\\.(${ext})$`),
  };
});

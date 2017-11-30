import { getProp, getPropValue, elementType } from 'jsx-ast-utils';

module.exports = {
  create: context => ({
    JSXOpeningElement: (node) => {
      const options = context.options[0] || {};
      const components = options.components || [];
      const nodeType = elementType(node);

      // Only check specified elements
      if (components.indexOf(nodeType) === -1) {
        return;
      }

      // Check for id field
      const idProp = getProp(node.attributes, 'id');
      const idValue = getPropValue(idProp);

      if (idProp && idProp.value !== null && idValue) {
        return;
      }

      // Report error
      context.report({
        node,
        message: `<${nodeType}> elements must have a valid "id" property.`,
      });
    },
  }),
};

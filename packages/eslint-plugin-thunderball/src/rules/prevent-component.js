import { elementType } from 'jsx-ast-utils';

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

      // Report error
      context.report({
        node,
        message: `<${nodeType}> elements are not allowed.`,
      });
    },
  }),
};

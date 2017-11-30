# React Components

  - Prefer **stateless function** components. Only use `classes` when needing to work with lifecycle methods.
    - They help prevent abuse of the setState() API, favoring props instead.
    - They encourage the "smart" vs. "dumb" component pattern.
    - They encourage code that is more reusable and modular.
    - They discourage giant, complicated components that do too many things.
    - In the future, they will allow React to make performance optimizations by avoiding unnecessary checks and memory allocations.
  - If using a **class** based component, use the `class` keyword variant instead of using `React.createClass`.
  - Think about **performance** of the render method and make use of the `componentShouldUpdate` or the `react-addons-shallow-compare` in most classes. To make this easier, instead use the `pure` and `onlyUpdateForKeys` higher-order components from `recompose`.
  - Each `View` on a `Page` should be a [container component](https://medium.com/@learnreact/container-components-c0e67432e005#.f36iiaygn) where it gets all the redux data needed and passes this data down to its children.  You should avoid having sub-components directly work with redux stores.
  - Do not use React `Mixin`
  - Avoid the DOM wherever possible!

##Avoid State in Components
- Avoid state in components. Instead aim to place all state in Redux.  However, some ephmeral state may need to be placed in some lower level components.
- If you do use state in your components:
  - Never pass state from a component up to a parent.  If the parent needs the state, it should own the state. State must flow down, never up.
 
##Component Layout and Structure
Every React component should be laid out in the following order:
1. **Imports** (required): Every component will have at least one import (`react`).  All imports should be at the top of each file.
2. **Styles** (optional): Frequently styles will be pulled in from a "styles" file.  However, if you do choose to define styles in the component, do it after the imports.  This ensures they are defined before being called.  Do not define styles inline. Instead pull them from these objects.
3. **Methods** (optional):  A component may have methods that need to be called before or during rendering.  Typically these come from external business logic or utility files, but sometimes they may occur in the component.  These must be defined  before the component.  You should **avoid** define methods or anonymous methods in the `render` method.  Rendering could happen often which will result in the function being created multiple times and adding more to the memory footprint.  Define your helper methods in this section.
4. **Component** (required): This is the actual React component.  Try to use stateless functions where possible.
5. **PropTypes**, ContextTypes, and DefaultProps (optional if no props):  Not every component will accept properties, but if any properties are expects, they should be explicitly defined after the component.  In many examples, you may see PropTypes defined inside the a component if it is a `class`.  However since PropTypes for pure render functions must be defined statically on the function, consistency should be held and always defined PropTypes after the component.
6. **Composition and Exports** (required):  You will always be exporting your component, and you will typically be using a `pure` or `onlyUpdateForKeys` higher-order function to increase performance.  Other higher-order functions such as `redux.connect` will also appear here.

###Example (pure-render-function component)
``` javascript
// Imports
import React from 'react';
import { compose, pure } from 'recompose';

// Styles (optional)
const myStyles = {
  text: {
    fontSize: 12,
    color: 'red'
  }
};

// Methods (optional)
const formatText = (text) => {
  return text.trim();
};

// Component
const MyComponent = ({ text }) => {
  return (
    <span style={myStyles.text}>{formatText(text)}</span>
  );
};

// PropTypes (optional)
MyComponent.propTypes = {
  text: React.PropTypes.string.isRequired
};

// Composition and Exports
export default compose(
  pure
)(MyComponent);
```

###Example (class component)
``` javascript
// Imports
import React from 'react';
import { compose, pure } from 'recompose';

// Styles (optional)
const myStyles = {
  text: {
    fontSize: 12,
    color: 'red'
  }
};

// Methods (optional)
const formatText = (text) => {
  return text.trim();
};

// Component
class MyComponent extends React.Component {
  render() {
    const { text } = this.props;
    
    return (
      <span style={myStyles.text}>{formatText(text)}</span>
    );
  }
};

// PropTypes (optional)
MyComponent.propTypes = {
  text: React.PropTypes.string.isRequired
};

// Composition and Exports
export default compose(
  pure
)(MyComponent);
```
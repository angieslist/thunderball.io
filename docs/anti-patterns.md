# Anti-Patterns

## React

* Accessing props in `getInitialState`. \([link](https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html)\)
* Creating new objects or functions in the `render` method \([link](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#.dgctmwv68)\)
* Checking for existance of a prop.  Should use `defaultProps` instead. \([link](https://github.com/planningcenter/react-patterns#existence-checking)\)
* Side effects in `render` method.
* Inheritance using Mixins.

## React Redux and Immutable JS
* Calling toJS inside of state selectors.
* Doing anything in a reducer that doesnt modify the state.  Make use of side-effects if you need to fire another action, or do the work in the action itself.



# Higher-Order Components

> A "[Higher Order Function](https://en.wikipedia.org/wiki/Higher-order_function)" is a mathematical term which defines a function that takes in one or more functions as arguments and returns a new function.

> Higher-Order Components can be used to compose new "concerns" on top of a function.  Since all React components return a `render` method, we can compose new functions on top of components that add additional functionality like "data", "analytics", "validation", etc.

The key pattern with Higher Order Components is that concerns are separated.  For example, a visual component can concentrate on just visual elements and later "compose" in additional concerns.  This separation produces:
- Pure code that is easy to reason about
- More reusable code
- Promotes smaller components
- Reduces merge conflicts between developers

## Recompose
To make composition of higher order components easier, make use of [Recompose](https://github.com/acdlite/recompose).  The most useful methods for use with Thunderball are:
- [compose](https://github.com/acdlite/recompose/blob/master/docs/API.md#compose): Composes multiple higher-order components into a single higher-order component
- [pure](https://github.com/acdlite/recompose/blob/master/docs/API.md#pure): Prevents the component from updating unless a prop has changed
- [onlyUpdateForKeys](https://github.com/acdlite/recompose/blob/master/docs/API.md#onlyupdateforkeys): Prevents the component from updating unless a prop corresponding to one of the given keys has changed

*Check out this video to see Recompose in action:
https://www.youtube.com/watch?v=zD_judE-bXk*
### Example
```
import React from 'react';
import { compose, pure } from 'recompose';

const TextWrapper = ({ text }) => {
  return (
    <div>{text}</div>
  );
};

TextWrapper.propTypes = {
  text: React.PropTypes.string.isRequired
};

export default compose(
  pure
)(TextWrapper);
```

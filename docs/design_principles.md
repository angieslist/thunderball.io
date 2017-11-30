# Design Principles

## Separate Concerns
- Each file and function should have **only one concern**.
  - For instance, a React Component should only contain details about how to render the component.  Business logic, validation, instrumentation, analytics, etc should be defined elsewhere and composed in where necessary.
  - Decouple all Logic from your Presentation

## Think Functionally

- Always use **Pure Functions** to avoid side affects.  Everything a function should need should come in as parameters.  React Components should be treated as a pure function as well.
- Embrace **Higher Order Functions**. These are functions that take in other functions and/or return functions which leads to clean composition.
  - https://www.youtube.com/watch?v=Fk--XUEorvc&t=10840s
- Avoid class iteration with keywords like `for`.  Instead use `map`, `reduce`, `filter` and other functions introduced in more recent versions of JavaScript.  Libraries such as `lodash` will also give you a number of functional utility methods.
- Embrace **immutability** and avoid mutating data.  Make use of `const` and other constructs in `ImmutableJs` to assist development.
  - JavaScript today has no native Immutable data types that use structural sharing, so be careful with immutability.  You may end up using a lot of memory. Usually this isnt a big deal with small data types.  But using **Persistent Data Structures** from libraries like `ImmutableJs` will allow a certain level of structural sharing.
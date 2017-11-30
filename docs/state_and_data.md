# State and Data

## ImmutableJs

ImmutableJs is a open source JavaScript collections library from Facebook. It provides immutable persistent collections via structural sharing. This yields:

* **Immutable**: once created, a collection cannot be altered at another point in time.
* **Persistent**: new collections can be created from a previous collection and a mutation such as set. The original collection is still valid after the new collection is created.
* **Structural Sharing**: new collections are created using as much of the same structure as the original collection as possible, reducing copying to a minimum to achieve space efficiency and acceptable performance. If the new collection is equal to the original, the original is often returned.

## Where is state Immutable?

Object state is immutable in the reducers and the redux store.   Once state is passed as props in the react component

## Performance

One popular pattern to use is to call toJS on immutable objects to avoid calling .get\(\) on immutable maps in react view components.  Avoid calling toJS in React life cycle methods such and componentShouldUpdate and redux selectors.  Desktop browsers will be able to handle the extra processing but mobile device may see performance problems.  Thunderball uses a library call [redux-immutable-to-js](https://github.com/nakamura-to/redux-immutable-to-js) to automaautomaticallyticly converts immutable maps to objects out side of the reducer.


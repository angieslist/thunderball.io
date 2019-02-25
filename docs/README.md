# Thunderball

![](thunderball-small.png)

## What is Thunderball?

Thunderball is a slightly opinionated server and client library for building rich applications in NodeJs, ReactJs, and Redux. Thunderball attempts to use industry standard libraries instead of reinventing things. However, stitching together these libraries on your own can be tedious and lead to confusion since there are many ways to do things.

The primary development units in Thunderball are called "Ions". Thunderball Ions are really just plugins/modules and are used to create web pages, express middleware, APIs, serve static assets, etc. Modules are built to be autonomous so that different developers and teams can work with a good level of code isolation.

Thunderball is initially targeting web applications. However, the build tools and many of the client library features could be extended to `react-native`, `electron`, and other platforms. We will be looking to expand to other platforms in the future.

## Getting Started

The easiest way to get started is with our yeoman generator. Open your terminal and type:

```
# install yeoman
npm install -g yo

# install the thunderball generator
npm install -g generator-thunderball

# make a new thunderball project
mkdir MYAPP && cd MYAPP
yo thunderball

# compile and run the new app
npm start

# go to http://localhost:8000
```

## Why Thunderball?

It can be difficult to create an application from scratch and even more difficult to decide what libraries to use and how they will interact with each other.

Unlike other "bootstrapping" frameworks out there for ReactJs applications, Thunderball is a platform that is meant to live under your application and _get out of your way_. There are numerous extension points to bend Thunderball to your will and in the end, you have control over how your application will work.

## What Major Libraries does Thunderball use?

### Client

* [react](https://facebook.github.io/react/): Primary UI framework. Instead of enforcing an artificial separation of concerns based on technology \(html, javascript, css\), react makes it easy to build well-encapsulated, self-updating, reusable components entirely in javascript that can easily be combined in a hierarchy to form larger components.
* [jsx](https://facebook.github.io/jsx/): HTML-like syntax sugar for building react components.
* [redux](http://redux.js.org/): Used to store application state in a single location
* [react-redux](https://github.com/reactjs/react-redux): Redux library for integration with ReactJs
* [redux-persist](https://github.com/rt2zz/redux-persist): Persists store data between page loads
* [redux-logger](https://github.com/evgenyrodionov/redux-logger): Logging middleware used in development to show when actions are fired and their data in the chrome developer console window
* [react-router](https://github.com/reactjs/react-router): Routing of sub-pages in a single-page-application
* [react-helmet-async](https://github.com/staylor/react-helmet-async): Give React components the ability to update pieces of the `<head>` element including things like the pages `title`.
* [react-intl](https://github.com/yahoo/react-intl): Provides components used to format numbers, currency, strings, dates, and times for localization or pluralization.

### Server

* [node](https://nodejs.org/en/): JavaScript server runtime for running Thunderball applications.
* [express](https://expressjs.com/): Simple Node web framework used to serve Thunderball pages and assets as well as proxy api calls.
* [gulp](http://gulpjs.com/): JavaScript build system used to run Thunderball applications in development and to generate assets needed for production builds.
* [webpack](https://webpack.github.io/): Module bundler for web applications that is used to create our assets and enable hot-loading.
* [yoeman](http://yeoman.io/): Generator to create new Thunderball such as applications, modules, and redux reducers.

### Utilities

* [immutablejs](https://facebook.github.io/immutable-js/): Brings immutable datatypes to JavaScript. This is used for objects in the redux stores
* [lodash](https://lodash.com/docs): Utility library bringing many functional paradigms to JavaScript
* [query-string](https://github.com/sindresorhus/query-string): Utility library for working with URL query strings

### Testing

* [Jest](https://facebook.github.io/jest/): A Facebook JavaScript and React testing framework
* [Enzyme](https://github.com/airbnb/enzyme): A testing library specifically for React that makes it easier to assert, manipulate, and traverse your React Component output. It's meant to be intuitive and flexible by mimicking jQuery's API for DOM manipulation and traversal.




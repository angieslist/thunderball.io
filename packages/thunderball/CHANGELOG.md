# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.3.0"></a>
# [0.3.0](https://github.com/angieslist/thunderball.io/compare/v0.2.0...v0.3.0) (2019-10-10)


### Bug Fixes

* **thunderball:** report and log errors in render ([9926b74](https://github.com/angieslist/thunderball.io/commit/9926b74))
* Resolve random CircleCI test failures and slowness ([230597c](https://github.com/angieslist/thunderball.io/commit/230597c))


### Features

* **thunderball:** Replace Gulp ESLint with Webpack ESLint ([1bae9c3](https://github.com/angieslist/thunderball.io/commit/1bae9c3))
* Babel 7 ([028bf7f](https://github.com/angieslist/thunderball.io/commit/028bf7f))
* react-helmet-async ([4afab84](https://github.com/angieslist/thunderball.io/commit/4afab84))
* Redis for SSR ([7bccccc](https://github.com/angieslist/thunderball.io/commit/7bccccc))
* Todo list example ([c7b7486](https://github.com/angieslist/thunderball.io/commit/c7b7486))


### BREAKING CHANGES

* Upgrade to Babel 7.
Clients may need to upgrade dependencies (e.g. Jest).
See thunderball-hello-world for examples.
* react-helmet-async replaces react-helmet
See https://github.com/staylor/react-helmet-async/blob/master/README.md
for usage or refer to the example in thunderball-hello-world
* **thunderball:** Gulp "lint" task has been removed.
If you want to run ESLint outside of webpack then
run "npx eslint" from the command line




<a name="0.2.0"></a>
# [0.2.0](https://github.com/angieslist/thunderball.io/compare/v0.1.2...v0.2.0) (2019-01-09)


### Features

* SSR improvements ([60956d8](https://github.com/angieslist/thunderball.io/commit/60956d8))
* Upgrade to React 16 ([f1572f9](https://github.com/angieslist/thunderball.io/commit/f1572f9))
* **thunderball:** Upgrade to Webpack 3 ([e9d1e9d](https://github.com/angieslist/thunderball.io/commit/e9d1e9d))


### BREAKING CHANGES

* **thunderball:** Since this is a new major version of Webpack
thunderball apps should check any custom Webpack configuration.
* 'getReactRendererCacheKey' now controls caching of React
component rendering. This allows finer control over caching with
two cache keys instead of one. If you have a custom 'getCacheKey'
in your config file then you will likely want an additional
'getReactRendererCacheKey' entry. To preserve previous behavior
the implementation of these functions can be identical.
* See reactjs.org for info on migrating from React 15 to 16




<a name="0.1.2"></a>
## [0.1.2](https://github.com/angieslist/thunderball.io/compare/v0.1.1...v0.1.2) (2018-06-02)


### Bug Fixes

* **thunderball:** Register thunderballMiddleware and compress only once ([dc03546](https://github.com/angieslist/thunderball.io/commit/dc03546))
* **thunderball:** Set data-react-checksum correctly ([4d9b7ad](https://github.com/angieslist/thunderball.io/commit/4d9b7ad))

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.2.0"></a>
# [0.2.0](https://github.com/angieslist/thunderball.io/compare/v0.1.2...v0.2.0) (2019-01-09)


### Features

* SSR improvements ([60956d8](https://github.com/angieslist/thunderball.io/commit/60956d8))
* Upgrade to React 16 ([f1572f9](https://github.com/angieslist/thunderball.io/commit/f1572f9))


### BREAKING CHANGES

* 'getReactRendererCacheKey' now controls caching of React
component rendering. This allows finer control over caching with
two cache keys instead of one. If you have a custom 'getCacheKey'
in your config file then you will likely want an additional
'getReactRendererCacheKey' entry. To preserve previous behavior
the implementation of these functions can be identical.
* See reactjs.org for info on migrating from React 15 to 16




<a name="0.1.2"></a>
## [0.1.2](https://github.com/angieslist/thunderball.io/compare/v0.1.1...v0.1.2) (2018-06-02)




**Note:** Version bump only for package generator-thunderball

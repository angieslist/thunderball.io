# Developer Experience

One of the primary goals of Thunderball is to create an fun and production developer experience.  This includes:
- Hot-loading
- Redboxing
- DevTools
- CLI Dashboards
- Fast build times

## Hot-loading
By using [React Hot Loader](https://gaearon.github.io/react-hot-loader) in webpack changes made to Thunderball applications are applied in "real time" while keeping the page mounted and preserving state. This allows you to tweak pages and see the results quickly while the data is still on the page.

## Redboxing

## DevTools

## CLI Dashboards

## Fast Build Times
Because Thunderball applications only build UI components and not complicated backend pieces, these apps can build in just a few minutes.  Most of the the build server time is spent zipping up all of the assets.  Unit tests, linting, and packaging should be fast. 
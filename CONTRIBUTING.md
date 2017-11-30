# Contributing to Thunderball

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Working on the Thunderball library with Lerna and `npm link`
(this is not necessary for Thunderball app development, only for work being done on the Thunderball library itself)

* `npm install`
* `npm run bootstrap`
* `npm test`

## To link from an application
### From the thunderball-client _package_ root
* `npm link`

### From the thunderball _package_ root
* `npm link`

### From the application root
* `npm link thunderball`
* `npm link thunderball-client`

### Docs

#### Installing Gitbook

If you do not yet have gitbook-cli installed, run the following:

```
npm install -g gitbook-cli
```

To install the latest version of `gitbook` and prepare to build the documentation, run the following:

```
npm run docs-prepare
```

#### Building the Docs

To build the documentation, run the following:

```
npm run docs-build
```

To watch and rebuild documentation when changes occur, run the following:

```
npm run docs-watch
```

The docs will be served at http://localhost:4000.

#### Publishing the Docs

To publish the documentation, run the following:

```
npm run docs-publish
```

#### Cleaning the Docs

To remove previously built documentation, run the following:

```
npm run docs-clean
```

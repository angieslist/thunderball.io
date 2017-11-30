# Ions
A Thunderball application is built and extended by hooking up various ions. Ions are really just plugins/modules for Thunderball applications. Ions can provide the following:
- Browser Pages
- Static Asset Directories
- Express Middleware

*Other extension points will be added over time* 

## Ion Configuration
Example configuration for hypothetical 'home' page
```javascript
module.exports = {
  name: 'Home',                               // The ion name
  browser: {
    page: {
      path: '/home',                          // The URL path
      createRoutes: './browser/createRoutes', // Path to the ion's createRoutes file
      injectors: [
        './homePageInjectors'                 // An array of paths to injector files
      ],
      // How to configure server side rendering (overwrites or merges values with ssr config in config.js)
      'ssr': {
        // Whether or not to render the body (default: true)
        renderBody: true,
        // Whether or not to use http steaming (default: false)
        useStreaming: false,
        // Define caching during server side rendering
        caching: {
          // Whether or not to memoize objects such as redux store, default state, etc (default: true)
          memoize: true,
          // Function to determine the cache key for rapscallion caching the entire page body (default: '(req) => url.parse(req.url).pathname')
          // Return 'undefined' to use no caching
          // If you have custom initial state, you may want a more complex cache key
          getCacheKey: (req) => url.parse(req.url).pathname
        },
        // Define an object containing the http headers to use when getting the page
        // This is merged with header config from the client
        // Most useful for setting headers such as 'cache-control'
        headers: {
          'cache-control': 'public, max-age: 7000'
        },
        // An array of strings or functions producing strings to inject before the page body
        // Useful for defining <script> tags
        beforeBody: [],
        // An array of strings or functions producing strings to inject after the page body
        // Useful for defining <script> tags
        afterBody: [],
        // Implement this function to determine initial state to store in redux for each page
        // Be sure to cache or memoize values
        // This function must return a Promise that resolves into a javascript object that is merged into the redux state
        getInitialState: async ((req, appConfig = {}) => {
          const port = appConfig.port || 8000;

          // We need absolute url since this is running the the server and has no idea where express routes are
          const result = await fetch(`http://127.0.0.1:${port}/foo/bar`, { allowOnServer: true, timeout: 500 });
          const bar = await result.json();
          return {
            foo: {
              bar
            }
          };
        })
      }
    }
  },
  staticDirectories: [                        // An array of static directories used by the ion
    {
      dir: './static',                        // The directory that contains the static content 
      path: '/home/static'                    // The URL route where the static content will be hosted
    }
  ],
  middleware: [
    ' ./homeMiddleware'                         // An array of paths to middlewares used by the ion
  ]
};
```

### Configuring: Browser Pages
- `path`: [string or array] A string or array of strings defining the url path that will navigate to the page.
- `createRoutes`: [string] A string defining the location of the file that exports the `createRoutes` method.  This method takes in the redux state and returns a `Route` element with child routes to Views.
- `injectors` [array]
- `props`: [object]


### Configuring: Static Asset Directories

The `staticDirectories` element of ion configuration is an array of `staticAsset` objects with the following fields:
  - `dir`: [string]
  - `path`: [string or arrray] A string or array of strings defining the url path that will navigate to the static asset directory.


### Configuring: Express Middleware
The `middleware` element of ion configuration is an array of strings that represent the relative paths to the definitions of each middleware.

### Example 1
This middleware acts like an API. Any `GET` request to `/hello` will hit this middleware and return a 'Hello World' object. This could be modified to make a database call or any other operation normally associated with an Restful API.  It could even be used to stub out mock apis until a final backedn is complete.

**manifest.js**
```javascript
module.exports = {
  middleware: [
    './middleware/helloWorld.js'
  ]
};
```

**middleware/helloWorld.js**
``` javascript
module.exports = (manifest, ions, app) => {
  return (req, res, next) => {
    if (req.method === 'GET' && req.path.toLowerCase() === '/hello') {
      res.send(200, {
        message: 'Hello World'
      });
    }
    next();
  };
};
```

### Example 2
This middleware listens for all requests and logs the request time as well as adding it to a `X-Request-Time` header to all responses.

**manifest.js**
```javascript
module.exports = {
  middleware: [
   './middleware/requestTime.js'
  ]
};
```

**middleware/requestTime.js**
``` javascript
module.exports = (manifest, ions, app) => {
  return (req, res, next) => {
    const timestamp = new Date().toLocaleString();
    console.log(`Request to '${req.path}' was made at '${timestamp}'`);
    res.setHeader('X-Request-Time', timestamp);
    next();
  };
};
```
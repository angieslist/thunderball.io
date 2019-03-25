module.exports = {
  extends: "airbnb",
  parser: "babel-eslint",
  plugins: [
    "jsx-control-statements",
  ],
  rules: {
    'react/jsx-filename-extension': 0,
    "react/jsx-no-undef": [
      2,
      {
        "allowGlobals": true
      }
    ],
  },
  overrides: [
    {
      files: [
        "**/*.spec.js",
        "**/*.spec.jsx",
        "**/__test__/*.js",
        "**/__test__/*.jsx",
        "jest.setup.js"
      ],
      plugins: [
        "jest"
      ],
      env: {
        "browser": true,
        "jest/globals": true
      },
      rules: {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/valid-expect": "off",
        // allow tests to import from devDependencies
        "import/no-extraneous-dependencies": [2, {
          "devDependencies": true
        }]
      }
    },
    {
      files: [
        "**/browser/**"
      ],
      env: {
        "browser": true
      }
    }
  ],
  env: {
    "jsx-control-statements/jsx-control-statements": true
  },
  globals: {
    // add isomorphic-fetch globals
    "fetch": false,
    "Response": false,
    "Headers": false,
    "Request": false
  }
};

module.exports = {
  extends: "airbnb",
  plugins: [
    "jsx-control-statements",
  ],
  overrides: [
    {
      files: [
        "**/*.spec.js",
        "**/__test__/*.js",
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
  }
};

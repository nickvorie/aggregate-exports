module.exports = {
  env: {
    es2017: true,
  },

  overrides: [
    {
      files: [
        "test/**/*.test.js",
        "test/**/*.test.ts",
      ],

      env: {
        jest: true,
      },

      rules: {
        "import/no-unresolved": ["error", {
          ignore: ["../"],
        }],
      },
    },
  ],

  extends: [
    "airbnb-base",
  ],

  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },

  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },

  plugins: [
    "@typescript-eslint",
  ],

  settings: {
    "import/resolver": {
      node: true,
    },
  },

  rules: {
    "quotes": ["error", "double"],
    "indent": "off",
    "no-tabs": ["off"],
    "max-len": ["warn", 150],
    "class-methods-use-this": ["off"],
    "no-unused-vars": ["off"],
    "lines-between-class-members": ["off"],
    "import/extensions": ["off"],
    "import/prefer-default-export": "off",
    "import/no-unresolved": ["error", {
      "ignore": ["@/"],
    }],
    "semi": "off",
    "no-plusplus": "off",
    "@typescript-eslint/semi": "error",
    "@typescript-eslint/indent": ["error", "tab"]
  },
};

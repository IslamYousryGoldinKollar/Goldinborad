module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  extends: ['eslint:recommended', 'plugin:jest/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'jest/expect-expect': 'warn',
    'jest/no-disabled-tests': 'warn'
  },
  ignorePatterns: ['node_modules/']
};

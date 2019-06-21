module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript'
  ],
  rules: {
    indent: ['error', 4],
    semi: ['error', 'never'],
    'no-tabs': 'off',
    'function-paren-newline': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-return-assign': 'off',
    'no-nested-ternary': 'off',
    'consistent-return': 'off',
    'class-methods-use-this': 'off',
    'camelcase': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-unused-expressions': 'off',
    'no-underscore-dangle': 'off'
  },
  parserOptions: {
    parser: 'typescript-eslint-parser'
  }
}

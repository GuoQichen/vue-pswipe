module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  rules: {
    indent: ['error', 4],
    semi: ['error', 'never'],
    'no-tabs': 0,
    'function-paren-newline': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-return-assign': 0,
    'no-nested-ternary': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
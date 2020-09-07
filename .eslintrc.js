module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'space-before-function-paren': ['error', 'never'],
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-expressions': ['warn'],
    'no-unused-vars': ['warn'],
    'keyword-spacing': ['warn'],
    'no-trailing-spaces': ['warn']
  }
}

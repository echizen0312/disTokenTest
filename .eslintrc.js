// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-labels": 'off',
    'no-unused-expressions':'off',
    'space-before-function-paren': 'off',
    'spaced-comment':'off',
    'semi': 'off',
    'no-var': 'error',
    'no-trailing-spaces':'off',
    'comma-spacing':'off',
    'space-before-blocks':'off',
    'space-infix-ops':'off',
    'keyword-spacing':'off',
    'eol-last':'off',
    'space-unary-ops':'off',
    'padded-blocks':'off',
    'no-tabs':'off',
    'brace-style':'off',
    'eqeqeq':'off',
    'no-mixed-spaces-and-tabs':'off',
    'no-unneeded-ternary':'off',
    'no-useless-return':'off',
    'no-extend-native': 'off',
    'operator-linebreak': 'off',
    'indent': 'off'
  }
}

module.exports = {
  root: true,

  env: {
    node: true,
  },

  parserOptions: {
    ecmaVersion: "latest",
  },

  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],

  rules: {
    "no-async-promise-executor": 0,
    "vue/no-v-html": 0,
    "vue/valid-v-slot": 0,
    "vue/html-self-closing": 0,
    "vue/require-prop-types": 0,
    "vue/require-default-prop": 0,
    "vue/max-attributes-per-line": 0,
    "vue/singleline-html-element-content-newline": 0,
    "vue/multi-word-component-names": 0,
    // "prettier-vue/prettier": [
    //   "error",
    //   {
    //     // Override all options of `prettier` here
    //     // @see https://prettier.io/docs/en/options.html
    //     printWidth: 120,
    //     singleQuote: false,
    //     semi: false,
    //     trailingComma: "es5",
    //   },
    // ],
  },
}

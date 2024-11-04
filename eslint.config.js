import pluginVue from 'eslint-plugin-vue'
export default [
  // add more generic rulesets here, such as:
  // js.configs.recommended,
  ...pluginVue.configs[('vue3-recommended', 'typescript/recommended')],

  {
    rules: {
      eqeqeq: ['error', 'always'],
      'no-console': ['error', { allow: ['warn', 'error', 'info', 'debug'] }],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: true,
        },
      ],
      'vue/require-default-prop': 'off',
    },
  },
]

import antfu from '@antfu/eslint-config';

export default antfu({
  typescript: true,
  formatters: true,
  rules: {
    'no-console': 'warn',
  },
  stylistic: {
    semi: true,
  },
});

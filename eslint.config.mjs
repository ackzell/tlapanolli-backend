import antfu from '@antfu/eslint-config';

export default antfu({
  typescript: true,
  formatters: true,
  rules: {
    'no-console': 'warn',
    // some import errors happening if I don't have this line
    'perfectionist/sort-imports': ['error', { type: 'natural' }],
    'node/no-process-env': ['error'],
  },
  stylistic: {
    semi: true,
  },
});

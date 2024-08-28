import antfu from '@antfu/eslint-config'

export default antfu(
  {
    files: ['frontend/**/*.ts', 'frontend/**/*.tsx'],
    react: true,
  },
  {
    files: ['scraper/**/*.ts'],
    node: true,
  },
)

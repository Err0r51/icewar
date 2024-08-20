import antfu from '@antfu/eslint-config'

export default antfu(
  {
    files: ['front/**/*.ts', 'front/**/*.tsx'],
    react: true,
  },
  {
    files: ['scraper/**/*.ts'],
  },
)

import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  failOnWarn: false,  // Disable fail on warnings
  entries: ['./src/index'],
  outDir: 'dist',
  declaration: true,
});

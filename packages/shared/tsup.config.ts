import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'types/index': 'src/types/index.ts',
    'schemas/index': 'src/schemas/index.ts',
    'constants/index': 'src/constants/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  outDir: 'dist',
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.js' : '.js' };
  },
  splitting: false,
  sourcemap: false,
  clean: true,
});

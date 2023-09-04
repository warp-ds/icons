import * as eik from '@eik/esbuild-plugin';
import esbuild from 'esbuild';

await eik.load();

await esbuild.build({
  plugins: [eik.plugin()],
  entryPoints: ['elements/index.js'],
  bundle: true,
  outfile: 'dist/elements/icons.js',
  format: 'esm',
  sourcemap: true,
  target: 'es2017',
  minify: true,
  external: ['lit'],
});

import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['elements/index.js'],
  bundle: true,
  outfile: 'dist/elements/icons.js',
  format: 'esm',
  sourcemap: true,
  target: 'es2017',
  minify: true,
  external: ['lit'],
});

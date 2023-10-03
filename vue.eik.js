import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['vue/index.js'],
  bundle: true,
  outfile: 'dist/vue/icons.js',
  format: 'esm',
  sourcemap: true,
  target: 'es2017',
  minify: true,
  external: ['vue'],
});
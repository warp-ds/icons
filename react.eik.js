import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['react/index.js'],
  bundle: true,
  outfile: 'dist/react/icons.js',
  format: 'esm',
  sourcemap: true,
  target: 'es2017',
  minify: true,
  external: ['react'],
});

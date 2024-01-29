import esbuild from 'esbuild';
import { glob } from 'glob';
import chalk from 'chalk';

const files = glob.sync('vue/*.js');

files.forEach(async (filePath) => {
  console.log(`${chalk.cyan('vue')}: Building vue icon ${chalk.yellow(filePath)} `);
  try {
    await esbuild.build({
      entryPoints: [filePath],
      bundle: true,
      outfile: `dist/${filePath}`,
      format: 'esm',
      sourcemap: true,
      target: 'es2017',
      minify: false,
      external: ['vue', '@lingui/core'],
    });
  } catch (err) {
    console.error(err);
  }
});

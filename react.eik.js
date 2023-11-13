import esbuild from "esbuild";
import { glob } from "glob";
import chalk from "chalk";

const files = glob.sync("react/*.js");

files.forEach(async (filePath) => {
  console.log(
    `${chalk.cyan("react")}: Building react icon ${chalk.yellow(
      filePath
    )} `
  );
  try {
    await esbuild.build({
      entryPoints: [filePath],
      bundle: true,
      outfile: `dist/${filePath}`,
      format: "esm",
      sourcemap: true,
      target: "es2017",
      minify: true,
      external: ["react", "@lingui/core"],
    });
  } catch (err) {
    console.error(err);
  }
});

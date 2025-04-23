import esbuild from "esbuild";
import { glob } from "glob";
import chalk from "chalk";

const files = glob.sync("elements/*.js");

files.forEach(async (filePath) => {
  try {
    await esbuild.build({
      entryPoints: [filePath],
      bundle: true,
      outfile: `dist/${filePath}`,
      format: "esm",
      sourcemap: true,
      target: "es2017",
      minify: false,
      external: ["lit", "@lingui/core"],
    });
  } catch (err) {
    console.error(err);
  }
});

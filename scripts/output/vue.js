import { mkdirSync, writeFileSync } from "node:fs";
import { join as joinPath } from "node:path";
import { getSVGs, getDirname } from "../util/helpers.js";
import chalk from "chalk";
import defaultIconDescriptions from "../../default-icon-descriptions.js";
import { buildMessages } from "../i18n-helpers/buildMessages.js";

const __dirname = getDirname(import.meta.url);
const icons = [];
const basepath = joinPath(__dirname, "../../vue/");
mkdirSync(basepath, { recursive: true });

const svgs = getSVGs();
const messages = await buildMessages(svgs, defaultIconDescriptions);

// Create Vue Icon
svgs.forEach(({ svg, filename, exportName, name }) => {
  const iconNameCamelCase = exportName.replace(/Icon|\d+/g, "");
  const titleMessage = defaultIconDescriptions[iconNameCamelCase.toLowerCase()];
  const attrs = Array.from(svg.attrs).map(
    (attr) => attr.name + `: ` + `'` + attr.value + `'`
  );
  const { message, id, comment } = titleMessage || {};
  const titleHtml = "<title>${title}</title>";
  // Handle i18n of icon title
  const output = [
    `import { i18n } from '@lingui/core';`,
    `import { activateI18n } from '../src/utils/i18n';`,
    `import { h } from 'vue'`,
    `const msgs = ${JSON.stringify(messages[name])}`,
    `activateI18n(msgs.en, msgs.nb, msgs.fi, msgs.da, msgs.sv);`,
    `const title = i18n.t({ message: \`${message}\`, id: '${id}', comment: '${comment}' });`,
    `export default (_, { attrs }) => h('svg', { ${attrs.join(
      ", "
    )}, innerHTML: ${"`"}${titleHtml}${svg.html}${"`"}, ...attrs })`,
  ].join("\n");
  const path = joinPath(basepath, filename);
  writeFileSync(path, output, "utf-8");
  icons.push({ exportName, filename });
});
console.log(
  `${chalk.green("vue")}: Wrote ${chalk.yellow(icons.length)} icon files`
);

const indexFile = icons
  .map(
    ({ exportName, filename }) =>
      `export { default as ${exportName} } from './${filename}'`
  )
  .join("\n");
const indexFilename = joinPath(basepath, "index.js");
writeFileSync(indexFilename, indexFile, "utf-8");
console.log(`${chalk.green("vue")}: Wrote ${chalk.yellow("index")} file`);

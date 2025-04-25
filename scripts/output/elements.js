import { mkdirSync, writeFileSync } from "node:fs";
import { join as joinPath } from "node:path";
import { getSVGs, getDirname } from "../util/helpers.js";
import chalk from "chalk";
import defaultIconDescriptions from "../../default-icon-descriptions.js";
import { buildMessages } from "../i18n-helpers/buildMessages.js";

const __dirname = getDirname(import.meta.url);
const icons = [];
const basepath = joinPath(__dirname, "../../elements/");
mkdirSync(basepath, { recursive: true });

const svgs = getSVGs();
const messages = await buildMessages(svgs, defaultIconDescriptions);

// Create Elements Icon
svgs.forEach(({ svg, name, size, filename, exportName }) => {
  const iconNameCamelCase = exportName.replace(/Icon|\d+/g, "");
  const titleMessage = defaultIconDescriptions[iconNameCamelCase.toLowerCase()];
  const attrs = Array.from(svg.attrs).map(
    (attr) => attr.name + `=` + `"` + attr.value + `"`
  );
  const { message, id, comment } = titleMessage || {};
  const titleHtml = "${unsafeStatic(`<title>${title}</title>`)}";
  const className = exportName;
  // Handle i18n for icon title
  const output = [
    `import { LitElement } from 'lit';`,
    `import { unsafeStatic, html } from "lit/static-html.js";`,
    `import { i18n } from '@lingui/core';`,
    `import { activateI18n } from '../src/utils/i18n';`,
    `const msgs = ${JSON.stringify(messages[name])}`,
    `activateI18n(msgs.en, msgs.nb, msgs.fi, msgs.da, msgs.sv);`,
    ``,
    ``,
    `export class ${className} extends LitElement {`,
    `  render() {
      const title = i18n.t({ message: \`${message}\`, id: '${id}', comment: '${comment}' });
      
      return html\`<svg ${attrs.join("")} part="w-icon-${name}-${size}-part">${titleHtml}${svg.html}</svg>\`; }`,
    `}`,
    `if (!customElements.get('w-icon-${name}-${size}')) {`,
    `  customElements.define('w-icon-${name}-${size}', ${className});`,
    `}`,
  ].join("\n");

  const path = joinPath(basepath, filename);
  writeFileSync(path, output, "utf-8");
  icons.push({ exportName, filename });
});
console.log(
  `${chalk.blue("lit")}: Wrote ${chalk.yellow(icons.length)} icon files`
);

const indexFile = icons
  .map(({ filename }) => `export * from './${filename}';`)
  .join("\n");
const indexFilename = joinPath(basepath, "index.js");
writeFileSync(indexFilename, indexFile, "utf-8");
console.log(`${chalk.blue("lit")}: Wrote ${chalk.yellow("index")} file`);

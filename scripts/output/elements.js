import { mkdirSync, writeFileSync } from "node:fs";
import { join as joinPath } from "node:path";
import { getSVGs, getDirname } from "../util/helpers.js";
import chalk from "chalk";
import defaultIconDescriptions from "../../default-icon-descriptions.js";

const __dirname = getDirname(import.meta.url);
const icons = [];
const basepath = joinPath(__dirname, "../../elements/");
mkdirSync(basepath, { recursive: true });

// Create Elements Icon
getSVGs().forEach(({ svg, name, size, filename, exportName }) => {
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
    `import { messages as nbMessages} from '../src/raw/${name}/locales/nb/messages.mjs';`,
    `import { messages as enMessages} from '../src/raw/${name}/locales/en/messages.mjs';`,
    `import { messages as fiMessages} from '../src/raw/${name}/locales/fi/messages.mjs';`,
    `import { messages as daMessages} from '../src/raw/${name}/locales/da/messages.mjs';`,
    `import { messages as svMessages} from '../src/raw/${name}/locales/sv/messages.mjs';`,
    `import { activateI18n } from '../src/utils/i18n';`,
    `activateI18n(enMessages, nbMessages, fiMessages, daMessages, svMessages);`,
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


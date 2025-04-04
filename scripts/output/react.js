import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join as joinPath } from 'node:path'
import { exec } from 'child_process'
import { getSVGs, getDirname } from '../util/helpers.js'
import chalk from 'chalk'
import defaultIconDescriptions from '../../default-icon-descriptions.js'

const __dirname = getDirname(import.meta.url);
const icons = [];
const basepath = joinPath(__dirname, '../../react/');
mkdirSync(basepath, { recursive: true });
const invalidIconSizes = [];

// Create React Icon
getSVGs().forEach(({ svg, filename, exportName, name }) => {
  // Handle i18n of icon title
  const iconNameCamelCase = exportName.replace('Icon', '').replace(/\d+/g, '');
  const titleMessage = defaultIconDescriptions[iconNameCamelCase.toLowerCase()];
  const attrs = Array.from(svg.attrs).map((attr) => attr.name + `: ` + `'` + attr.value + `'`);
  validateSize(svg.attrs, filename);
  const { message, id, comment } = titleMessage || {};
  const titleHtml = "<title>${title}</title>";
  const output = [
    `import React from 'react';`,
    `import { i18n } from '@lingui/core';`,
    `import { messages as nbMessages} from '../src/raw/${name}/locales/nb/messages.mjs';`,
    `import { messages as enMessages} from '../src/raw/${name}/locales/en/messages.mjs';`,
    `import { messages as fiMessages} from '../src/raw/${name}/locales/fi/messages.mjs';`,
    `import { messages as daMessages} from '../src/raw/${name}/locales/da/messages.mjs';`,
    `import { messages as svMessages} from '../src/raw/${name}/locales/sv/messages.mjs';`,
    `import { activateI18n } from '../src/utils/i18n';`,
    `activateI18n(enMessages, nbMessages, fiMessages, daMessages, svMessages);`,
    `const title = i18n.t({ message: \`${message}\`, id: '${id}', comment: '${comment}' });`,
    `/** @param {React.SVGProps<SVGSVGElement>} attrs */`,
    `export const ${exportName} = (attrs) => React.createElement('svg', { ${attrs.join(", ")}, dangerouslySetInnerHTML: { __html: ${'`'}${titleHtml}${svg.html}${'`'} }, ...attrs, });`,
    `export default ${exportName};`
  ].join("\n");

  const path = joinPath(basepath, filename)
  writeFileSync(path, output, 'utf-8')
  icons.push({ exportName, filename, name })
})

const iconNames = Array.from(new Set(icons.map(icon => icon.name)));
console.log(`${chalk.cyan('react')}: Processing ${chalk.yellow(iconNames.length)} icons`)
console.log(`${chalk.cyan('react')}: Wrote ${chalk.yellow(icons.length)} icon files (different sizes for the same icon)`)

// Create index file
const indexFile = icons.map(({ filename }) => `export * from './${filename}'`).join('\n');
const indexFilename = joinPath(basepath, 'index.js');
writeFileSync(indexFilename, `${indexFile}`, 'utf-8');
console.log(`${chalk.cyan('react')}: Wrote ${chalk.yellow('index')} file`);
if (invalidIconSizes.length > 0) {
  console.log(`${chalk.red(`Icons with invalid width or height attribute:`)}\n${invalidIconSizes.join('\n')}`);
}

function validateSize(svgAttrs, filename) {
  const attrs = {};
  Array.from(svgAttrs).forEach((attr) => {
    attrs[attr.name] = attr.value;
  });
  const { width, height } = attrs;
  const sizeFromFilename = filename.match(/\d+(\.\d+)?/g)[0];

  if (sizeFromFilename !== width || ![16, 24, 32, 42, 28, 48, 56].includes(Number(height))) {
    invalidIconSizes.push(filename);
  }
}

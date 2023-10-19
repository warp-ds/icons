import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join as joinPath } from 'node:path'
import { exec } from 'child_process'
import { getSVGs, getDirname } from '../util/helpers.js'
import chalk from 'chalk'
import defaultIconDescriptions from '../../default-icon-descriptions.js'

const __dirname = getDirname(import.meta.url)
const icons = []
const basepath = joinPath(__dirname, '../../react/')
mkdirSync(basepath, { recursive: true })

// Create React Icon
getSVGs().forEach(({ svg, filename, exportName, name }) => {
  // Handle i18n of icon title
  const iconNameCamelCase = exportName.replace('Icon', '').replace(/\d+/g, '');
  const titleMessage = defaultIconDescriptions[iconNameCamelCase.toLowerCase()];
  const attrs = Array.from(svg.attrs).map(attr => attr.name + `: ` + `'` + attr.value + `'`)
  const { message, id, comment } = titleMessage || {};
  const titleHtml = "<title>${title}</title>";
  const output = [
    `import React from 'react';`,
    `import { i18n } from '@lingui/core';`,
    `import { messages as nbMessages} from '../../src/raw/${name}/locales/nb/messages.mjs';`,
    `import { messages as enMessages} from '../../src/raw/${name}/locales/en/messages.mjs';`,
    `import { messages as fiMessages} from '../../src/raw/${name}/locales/fi/messages.mjs';`,
    `import { activateI18n } from '../../src/utils/i18n';`,
    `activateI18n(enMessages, nbMessages, fiMessages);`,
    `const title = i18n.t({ message: \`${message}\`, id: '${id}', comment: '${comment}' });`,
    `export const ${exportName} = (attrs) => React.createElement('svg', { ${attrs.join(", ")}, dangerouslySetInnerHTML: { __html: ${'`'}${titleHtml}${svg.html}${'`'} }, ...attrs, });`,
  ].join("\n");


  // Make subfolder for each icon name if it doesn't exist
  const iconNamePath = `${basepath}${name}/`;
  !existsSync(iconNamePath) && mkdirSync(iconNamePath, { recursive: true })

  const path = joinPath(iconNamePath, filename)
  writeFileSync(path, output, 'utf-8')
  icons.push({ exportName, filename, name })
})

const iconNames = Array.from(new Set(icons.map(icon => icon.name)));
console.log(`${chalk.cyan('react')}: Processing ${chalk.yellow(iconNames.length)} icons`)
console.log(`${chalk.cyan('react')}: Wrote ${chalk.yellow(icons.length)} icon files (different sizes for the same icon)`)

// Create index file
const indexFile = icons.map(({ filename, name }) => `export * from './${name}/${filename}'`) .join("\n");
const indexFilename = joinPath(basepath, 'index.js')
writeFileSync(indexFilename, `${indexFile}`, 'utf-8')
console.log(`${chalk.cyan('react')}: Wrote ${chalk.yellow('index')} file`)

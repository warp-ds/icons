import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join as joinPath } from 'node:path'
import { getSVGs, getDirname } from '../util/helpers.js'
import chalk from 'chalk'
import defaultIconDescriptions from '../../default-icon-descriptions.js'

const __dirname = getDirname(import.meta.url)
const icons = []
const basepath = joinPath(__dirname, '../../elements/')
mkdirSync(basepath, { recursive: true })

// Create Elements Icon
getSVGs().forEach(({ svg, name, size, filename, exportName }) => {
  const iconNameCamelCase = exportName.replace(/Icon|\d+/g, '');
  const titleMessage = defaultIconDescriptions[iconNameCamelCase.toLowerCase()];
  const attrs = Array.from(svg.attrs).map(attr => attr.name + `=` + `"` + attr.value + `"`)
  const { message, id, comment } = titleMessage || {};
  const titleHtml = "<title>${title}</title>";
  const className = exportName
  // Handle i18n for icon title
  const output = [
    `import { LitElement, html, svg } from 'lit';`,
    `import { i18n } from '@lingui/core';`,
    `import { messages as nbMessages} from '../../src/raw/${name}/locales/nb/messages.mjs';`,
    `import { messages as enMessages} from '../../src/raw/${name}/locales/en/messages.mjs';`,
    `import { messages as fiMessages} from '../../src/raw/${name}/locales/fi/messages.mjs';`,
    `import { activateI18n } from '../../src/utils/i18n';`,
    `activateI18n(enMessages, nbMessages, fiMessages);`,
    ``,
    ``,
    `export class ${className} extends LitElement {`,
    `  render() {
      const title = i18n.t({ message: \`${message}\`, id: '${id}', comment: '${comment}' });
      
      return html\`<svg ${attrs.join('')}>${titleHtml}${svg.html}</svg>\`; }`,
    `}`,
    `if (!customElements.get('w-icon-${name}${size}', ${className})) {`,
    `  customElements.define('w-icon-${name}${size}', ${className});`,
    `}`,
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

import { mkdirSync, writeFileSync } from 'node:fs'
import { join as joinPath } from 'node:path'
import { getSVGs, getDirname } from '../util/helpers.js'
import chalk from 'chalk'
import defaultIconDescriptions from '../../default-icon-descriptions.js'

const __dirname = getDirname(import.meta.url)
const icons = []
const basepath = joinPath(__dirname, '../../vue/')
mkdirSync(basepath, { recursive: true })

// Create Vue Icon
getSVGs().forEach(({ svg, filename, exportName, name }) => {
    // Handle i18n of icon title
    const iconNameCamelCase = exportName.replace('Icon', '').replace(/\d+/g, '');
    const titleMessage = defaultIconDescriptions[iconNameCamelCase.toLowerCase()];
  const attrs = Array.from(svg.attrs).map(attr => attr.name + `: ` + `'` + attr.value + `'`)
  const { message, id, comment } = titleMessage || {};
  const titleHtml = "<title>${title}</title>";
  const output = [
    `import { i18n } from '@lingui/core';`,
    `import { messages as nbMessages} from '../src/raw/${name}/locales/nb/messages.mjs';`,
    `import { messages as enMessages} from '../src/raw/${name}/locales/en/messages.mjs';`,
    `import { messages as fiMessages} from '../src/raw/${name}/locales/fi/messages.mjs';`,
    `import { activateI18n } from '../src/utils/i18n';`,
    `activateI18n(enMessages, nbMessages, fiMessages);`,
    `const title = i18n.t({ message: \`${message}\`, id: '${id}', comment: '${comment}' });`,
    `import { h } from 'vue'`,
    `export default (_, { attrs }) => h('svg', { ${attrs.join(', ')}, innerHTML: ${'`'}${titleHtml}${svg.html}${'`'}, ...attrs })`
  ].join('\n')
  const path = joinPath(basepath, filename)
  writeFileSync(path, output, 'utf-8')
  icons.push({ exportName, filename })
})
console.log(`${chalk.green('vue')}: Wrote ${chalk.yellow(icons.length)} icon files`)

const indexFile = icons.map(({ exportName, filename }) => `export { default as ${exportName} } from './${filename}'`).join('\n')
const indexFilename = joinPath(basepath, 'index.js')
writeFileSync(indexFilename, indexFile, 'utf-8')
console.log(`${chalk.green('vue')}: Wrote ${chalk.yellow('index')} file`)
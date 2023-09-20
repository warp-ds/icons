import { mkdirSync, writeFileSync } from 'node:fs'
import { join as joinPath } from 'node:path'
import { getSVGs, getDirname } from '../util/helpers.js'
import chalk from 'chalk'

const __dirname = getDirname(import.meta.url)
const icons = []
const basepath = joinPath(__dirname, '../../elements/')
mkdirSync(basepath, { recursive: true })

getSVGs().forEach(({ svg, name, size, filename, exportName }) => {
  const attrs = Array.from(svg.attrs).map(attr => attr.name + `=` + `"` + attr.value + `"`)
  const className = exportName
  const output = [
    `import { LitElement, html, svg } from 'lit';`,
    ``,
    `export class ${className} extends LitElement {`,
    `  render() { return html\`<svg ${attrs.join(' ')}>${svg.html}</svg>\`; }`,
    `}`,
    `if (!customElements.get('w-icon-${name}${size}', ${className})) {`,
    `  customElements.define('w-icon-${name}${size}', ${className});`,
    `}`,
  ].join("\n");


  const path = joinPath(basepath, filename)
  writeFileSync(path, output, 'utf-8')
  icons.push({ exportName, filename })
})
console.log(`${chalk.blue('lit')}: Wrote ${chalk.yellow(icons.length)} icon files`)

const indexFile = icons.map(({ filename }) => `export * from './${filename}';`).join("\n");
const indexFilename = joinPath(basepath, 'index.js')
writeFileSync(indexFilename, indexFile, 'utf-8')
console.log(`${chalk.blue('lit')}: Wrote ${chalk.yellow('index')} file`)

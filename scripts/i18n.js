import { writeFileSync } from 'node:fs'
import { join as joinPath } from 'node:path'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import chalk from 'chalk'
import { getSVGs, getDirname } from './util/helpers.js'
import defaultIconDescriptions from '../default-icon-descriptions.js'

/**
 * Script to add localization files (.po files and .mjs files).
 * These files are imported and used in the react, vue and elements icons.
 */
const __dirname = getDirname(import.meta.url)
const rootPath = joinPath(__dirname, '..');

// Generate a temp folder for icon usage that Lingui can scan later
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Iterate through the icons and create a separate file for each
getSVGs().forEach(({ exportName, name }) => {
  const iconNameCamelCase = exportName.replace('Icon', '').replace(/\d+/g, '');
  console.log({ name});
  
  const titleMessage = defaultIconDescriptions[iconNameCamelCase.toLowerCase()];
  const { message, id, comment } = titleMessage || {};
  
  // Generate the file content
  const content = `import { i18n } from '@lingui/core';\nconst ${iconNameCamelCase} = i18n.t({ message: \`${message}\`, id: '${id}', comment: '${comment}' });`;
  
  // Define the file path for the icon
  const filePath = path.join(tempDir, `${name}.js`);
  
  // Write the content to the file
  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log('Files generated in the "temp" folder.');

// Create lingui config
const iconNames = []
getSVGs().forEach(({ name }) => {
  iconNames.push(name)
});

const linguiCatalogs = iconNames.map((name) => ({
  include: [`scripts/temp/${name}.js`], // What files to scan for texts to translate 
  path: `src/raw/${name}/locales/{locale}/messages` // Where to output the files
}));

const linguiConfigContent = `
import type { LinguiConfig } from '@lingui/conf';

const config: LinguiConfig = {
  locales: ['en', 'nb', 'fi'],
  sourceLocale: 'en',
  catalogs: ${JSON.stringify(linguiCatalogs)},
  compileNamespace: 'es',
};

export default config;`

writeFileSync(joinPath(rootPath, 'lingui.config.ts'), `${linguiConfigContent}`, 'utf-8')
console.log(`${chalk.cyan('build')}: Wrote ${chalk.yellow('lingui.config.ts')} file`)

// Extract messages with Lingui
exec('lingui extract', (error) => {
  if (error) {
    console.error(`${chalk.cyan('build')}: Error: ${chalk.red(error.message)}`)
    return;
  }
  console.log(`${chalk.cyan('build')}: ${chalk.yellow('Lingui')} extracted messages`)

  // Compile messages with Lingui
  exec('lingui compile', (error) => {
    if (error) {
      console.error(`${chalk.cyan('build')}: Error: ${chalk.red(error.message)}`)
      return;
    }
    console.log(`${chalk.cyan('build')}: ${chalk.yellow('Lingui')} compiled messages`)
  });
});
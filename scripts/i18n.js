import { writeFileSync } from 'node:fs'
import { join as joinPath } from 'node:path'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import chalk from 'chalk'
import { getSVGs, getDirname } from './util/helpers.js'
import defaultIconDescriptions from '../default-icon-descriptions.js'
import yaml from 'js-yaml';

/**
 * Script to add localization files (.po files and .mjs files).
 * The .mjs files are compiled from the .po files.
 * These .mjs files are imported and used in the react, vue and elements icons.
 * 
 */
const __dirname = getDirname(import.meta.url)
const rootPath = joinPath(__dirname, '..');

// Generate a temp folder for "icon usage" that Lingui can scan later
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Get all icons (size doesn't matter)
const getIconName = (name) => {
  return name.replace('Icon', '').replace(/\d+/g, '');
}
const icons = {}; // [camelCase]: kebab-case
getSVGs().forEach(({ name, exportName }) => {
  const camelCaseName = getIconName(exportName);
  if (!icons[camelCaseName]) {
    icons[camelCaseName] = name
  }
});

// Make a file per icon to hold the usage of the text to be translated. Lingui will scan these files.
Object.entries(icons).forEach(([camelCase, kebabCase]) => {
  const iconName = getIconName(camelCase)
  const titleMessage = defaultIconDescriptions[iconName.toLowerCase()];
  const { message, id, comment } = titleMessage || {};
  const content = `import { i18n } from '@lingui/core';\nconst ${iconName} = i18n.t({ message: \`${message}\`, id: '${id}', comment: '${comment}' });`;
  const outputFilePath = path.join(tempDir, `${kebabCase}.js`);
  fs.writeFileSync(outputFilePath, content, 'utf-8');
});

console.log(`${chalk.cyan('i18n')}: Wrote ${chalk.yellow(Object.keys(icons).length)} temp icon files to hold strings to be translated`)

// Create lingui config
const linguiCatalogs = Object.values(icons).map((name) => ({
  include: [`scripts/temp/${name}.js`], // What files to scan for texts to translate 
  path: `src/raw/${name}/locales/{locale}/messages` // Where to output the files
}));

const linguiConfigContent = `
import type { LinguiConfig } from '@lingui/conf';

// This file is auto generated by the i18n script
const config: LinguiConfig = {
  locales: ['en', 'nb', 'fi'],
  sourceLocale: 'en',
  catalogs: ${JSON.stringify(linguiCatalogs)},
  compileNamespace: 'es',
};

export default config;`

writeFileSync(joinPath(rootPath, 'lingui.config.ts'), `${linguiConfigContent}`, 'utf-8')
console.log(`${chalk.cyan('i18n')}: Wrote ${chalk.yellow('lingui.config.ts')} file`)

// Extract messages with Lingui
exec('lingui extract', (error) => {
  if (error) {
    console.error(`${chalk.cyan('i18n')}: Error: ${chalk.red(error.message)}`)
    return;
  }
  console.log(`${chalk.cyan('i18n')}: ${chalk.yellow('Lingui')} extracted messages`)

  // Compile messages with Lingui
  exec('lingui compile', (error) => {
    if (error) {
      console.error(`${chalk.cyan('i18n')}: Error: ${chalk.red(error.message)}`)
      return;
    }
    console.log(`${chalk.cyan('i18n')}: ${chalk.yellow('Lingui')} compiled messages`)
  });
});

// Create crowdin.yml file
const files = [];
Object.values(icons).map(iconFolderName => {
  files.push({
    source: `/src/raw/${iconFolderName}/locales/en/messages.po`, // Path to the source file
    dest: `/icons/**/%original_file_name%`, // Destination path in the repository
    translation: `/src/raw/${iconFolderName}/locales/%two_letters_code%/messages.po` // Path to the translation files
  })
});

const crowdinContent = yaml.dump(`
project_id_env: CROWDIN_PROJECT_ID
api_token_env: CROWDIN_API_TOKEN
base_url_env: CROWDIN_BASE_URL
base_path: "."

preserve_hierarchy: true
files:
  ${JSON.stringify(files)}
`);

const crowdinConfigFilePath = `${rootPath}/crowdin.yml`;
fs.writeFileSync(crowdinConfigFilePath, crowdinContent, 'utf-8');

console.log(`${chalk.cyan('i18n')}: Wrote ${chalk.yellow('crowdin.yml')} file`)


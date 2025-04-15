import { writeFileSync } from "node:fs";
import { join as joinPath } from "node:path";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import chalk from "chalk";
import { getSVGs, getDirname } from "./util/helpers.js";
import defaultIconDescriptions from "../default-icon-descriptions.js";
import yaml from "yaml";

/**
 * Script to add localization files (.po files and .mjs files).
 * The .mjs files are compiled from the .po files.
 * These .mjs files are imported and used in the react, vue and elements icons.
 *
 */
const __dirname = getDirname(import.meta.url);
const rootPath = joinPath(__dirname, "..");

// Generate a temp folder for "icon usage" that Lingui can scan later
const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Get all icons (size doesn't matter)
const getIconName = (name) => {
  return name.replace("Icon", "").replace(/\d+/g, "");
};
const icons = {}; // [camelCase]: kebab-case
getSVGs().forEach(({ name, exportName }) => {
  const camelCaseName = getIconName(exportName);
  if (!icons[camelCaseName]) {
    icons[camelCaseName] = name;
  }
});

// Make a single file to hold usage of all texts to be translated
const allMessages = Object.entries(icons).map(([camelCase, _kebabCase]) => {
  const iconName = getIconName(camelCase);
  const titleMessage = defaultIconDescriptions[iconName.toLowerCase()];
  if (!titleMessage) {
    console.error(
      `${chalk.red("ERROR")}: No default description found for ${chalk.yellow(
        iconName
      )}`
    );
  }

  const { message, id, comment } = titleMessage || {};

  return `const ${iconName} = i18n.t({ message: \`${message}\`, id: '${id}', comment: '${comment}' });`;
});

// Write a single temp file
const unifiedContent = `import { i18n } from '@lingui/core';\n\n${allMessages.join(
  "\n"
)}`;
const outputFilePath = path.join(tempDir, "icon-translations.js");
fs.writeFileSync(outputFilePath, unifiedContent, "utf-8");

console.log(
  `${chalk.cyan("i18n")}: Wrote ${chalk.yellow(
    "icon-translations.js"
  )} with ${chalk.yellow(allMessages.length)} entries`
);

// Extract messages with Lingui
exec("lingui extract --clean", (error) => {
  if (error) {
    console.error(`${chalk.cyan("i18n")}: Error: ${chalk.red(error.message)}`);
    return;
  }
  console.log(
    `${chalk.cyan("i18n")}: ${chalk.yellow("Lingui")} extracted messages`
  );

  // Compile messages with Lingui
  exec("lingui compile", (error) => {
    if (error) {
      console.error(
        `${chalk.cyan("i18n")}: Error: ${chalk.red(error.message)}`
      );
      return;
    }
    console.log(
      `${chalk.cyan("i18n")}: ${chalk.yellow("Lingui")} compiled messages`
    );
  });
});

// Create crowdin.yml file
const files = [
  {
    source: `/src/locales/en/messages.po`, // Path to the source file
    dest: `/icons/**/%original_file_name%`, // Destination path in the repository
    translation: `/src/locales/%two_letters_code%/messages.po`, // Path to the translation files
  },
];

const crowdinContent = yaml.stringify(
  {
    project_id_env: "CROWDIN_PROJECT_ID",
    api_token_env: "CROWDIN_API_TOKEN",
    base_url_env: "CROWDIN_BASE_URL",
    base_path: ".",

    preserve_hierarchy: true,
    files: files,
  },
  { blockQuote: "literal" }
);

const crowdinConfigFilePath = `${rootPath}/crowdin.yml`;
fs.writeFileSync(crowdinConfigFilePath, crowdinContent, "utf-8");

console.log(`${chalk.cyan("i18n")}: Wrote ${chalk.yellow("crowdin.yml")} file`);

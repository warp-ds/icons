import fs from 'fs';
import path from 'path';
import { getDirname } from '../util/helpers.js'

/**
 * Helper to remove locales folder
 * Test that localization files in raw folder are made correctly with the i18n script
 */

const __dirname = getDirname(import.meta.url)
const srcPath = path.join(__dirname, '../../src');

// Remove "locales" directories
function removeLocalesDirs(directory) {
  fs.readdirSync(directory).forEach(item => {
    const itemPath = path.join(directory, item);
    if (fs.statSync(itemPath).isDirectory()) {
      if (item === 'locales') {
        console.log(`Removing ${itemPath}`);
        fs.rmSync(itemPath, { recursive: true });
      } else {
        removeLocalesDirs(itemPath);
      }
    }
  });
}

// Start the process from src
removeLocalesDirs(srcPath);
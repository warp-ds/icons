import { join as joinPath, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";

export async function buildMessages(svgs, defaultIconDescriptions) {
  let msgs = {};
  const __dirname = dirname(fileURLToPath(import.meta.url));
  for (const s of svgs) {
    const iconNameCamelCase = s.exportName
      .replace("Icon", "")
      .replace(/\d+/g, "");
    const iconId = defaultIconDescriptions[iconNameCamelCase.toLowerCase()].id;

    try {
      const [nb, en, fi, da, sv] = (
        await Promise.all([
          import(joinPath(__dirname, `../../src/locales/nb/messages.mjs`)),
          import(joinPath(__dirname, `../../src/locales/en/messages.mjs`)),
          import(joinPath(__dirname, `../../src/locales/fi/messages.mjs`)),
          import(joinPath(__dirname, `../../src/locales/da/messages.mjs`)),
          import(joinPath(__dirname, `../../src/locales/sv/messages.mjs`)),
        ])
      ).map((e) => e.messages);

      const locales = { nb, en, fi, da, sv };

      for (const [locale, messages] of Object.entries(locales)) {
        if (!messages[iconId]) {
          console.warn(
            chalk.yellow(
              `⚠ Missing translation for "${iconId}" in locale "${locale}" (icon: ${s.name})`
            )
          );
        }
      }

      msgs[s.name] = {
        nb: { [iconId]: nb[iconId] },
        en: { [iconId]: en[iconId] },
        fi: { [iconId]: fi[iconId] },
        da: { [iconId]: da[iconId] },
        sv: { [iconId]: sv[iconId] },
      };
    } catch (err) {
      console.error(err);
    }
  }
  return msgs;
}

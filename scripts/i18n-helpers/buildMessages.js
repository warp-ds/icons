import { join as joinPath, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export async function buildMessages(svgs) {
  let msgs = {};
  const __dirname = dirname(fileURLToPath(import.meta.url));
  for (const s of svgs) {
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

      const iconTitle = `icon.title.${s.name}`;
      msgs[s.name] = {
        nb: { [iconTitle]: nb[`icon.title.${s.name}`] },
        en: { [iconTitle]: en[`icon.title.${s.name}`] },
        fi: { [iconTitle]: fi[`icon.title.${s.name}`] },
        da: { [iconTitle]: da[`icon.title.${s.name}`] },
        sv: { [iconTitle]: sv[`icon.title.${s.name}`] },
      };
    } catch (err) {
      console.error(err);
    }
  }
  return msgs;
}

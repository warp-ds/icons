import { join as joinPath, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export async function buildMessages(svgs, defaultIconDescriptions) {
  let msgs = {};
  const __dirname = dirname(fileURLToPath(import.meta.url));
  for (const s of svgs) {
      const iconNameCamelCase = s.exportName.replace("Icon", "").replace(/\d+/g, "");
      const titleMessage = defaultIconDescriptions[iconNameCamelCase.toLowerCase()];
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

      msgs[s.name] = {
        nb: { [titleMessage.id]: nb[titleMessage.id] },
        en: { [titleMessage.id]: en[titleMessage.id] },
        fi: { [titleMessage.id]: fi[titleMessage.id] },
        da: { [titleMessage.id]: da[titleMessage.id] },
        sv: { [titleMessage.id]: sv[titleMessage.id] },
      };
    } catch (err) {
      console.error(err);
    }
  }
  return msgs;
}

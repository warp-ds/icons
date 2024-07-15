import fs from "fs-extra";
import { glob } from "glob";
import { getNameAndSize } from "./util/helpers.js";

export const iconsBySize = () => {
  const iconsBySize = {};
  const svgPaths = glob.sync(`./dist/**/*.svg`).sort();
  const icons = svgPaths.map((svgPath) => {
    const svg = fs.readFileSync(svgPath, "utf-8");
    const { name, size } = getNameAndSize(svgPath);
    return {
      name,
      svg,
      iconSize: size,
    };
  });
  icons.forEach((icon) => {
    if (iconsBySize[icon.iconSize]) {
      iconsBySize[icon.iconSize].push(icon);
    } else {
      iconsBySize[icon.iconSize] = [icon];
    }
  });
  return iconsBySize;
};
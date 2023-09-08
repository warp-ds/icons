import fs from "fs-extra";
import { glob } from "glob";
import path from "path";
import { getNameAndSize } from "./util/helpers.js";

const svgPaths = glob.sync(`./dist/**/*.svg`);

export const iconsBySize = () => {
  const iconsBySize = {};
  const icons = svgPaths.map((svgPath) => {
    const data = fs.readFileSync(svgPath, "utf-8");
    const {size} =  getNameAndSize(svgPath);
    return {
      name: path.basename(path.dirname(svgPath)),
      svg: data,
      iconSize: size,
    };
  });  
  for (const icon of icons) {
    const array = iconsBySize[icon.iconSize] || [];
    array.push(icon);
    iconsBySize[icon.iconSize] = array;
  }
  return iconsBySize;  
};
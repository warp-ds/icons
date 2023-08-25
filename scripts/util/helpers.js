import { Window } from 'happy-dom'
import camelcase from 'camelcase'

const pathRegex = /(?<iconPath>.*)\/icon_(?<size>\d+).svg/
const getIconName = (path) => path?.substring(path?.lastIndexOf('/') + 1);
export const getNameAndSize = (filepath) => {
    const {iconPath, size} = filepath.match(pathRegex).groups;
    return { name: getIconName(iconPath), size }
}

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
export const pascalCase = str => capitalize(camelcase(str))

export function getSVG(svg) {
  const el = getElement({ selector: 'svg', htmlString: svg })
  return { attrs: el.attributes, html: el.innerHTML }
}

export function getElement({ selector, htmlString }) {
  const window = new Window()
  window.document.body.innerHTML = htmlString
  return window.document.querySelector(selector)
}

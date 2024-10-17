# WARP icons
The icon set for WARP, imported from (Figma project)[https://www.figma.com/file/yEx16ew6S0Xgd579dN4hsM/Warp---Icons?type=design&node-id=150-113&mode=design&t=TRtIuPlsDoYlbuqd-0].

**Note that the icons in the "src/raw" folder in this repository should never be used directly, as they aren't optimized. Also note that Raw icons don't contain title element and hence won't follow accessibility guidelines**

## How to use

### React

#### Install dependencies

```sh
npm install @warp-ds/icons
```

#### Import React icons

```jsx
import { IconBag16 } from '@warp-ds/icons/react';
```

```jsx
<IconBag16 />
```

### Vue

#### Install dependencies

```sh
npm install @warp-ds/icons
```

#### Import Vue icons

```js
import { IconChevronRight16 } from '@warp-ds/icons/vue';
```

```js
<icon-chevron-right-16 />
```

### Elements

#### Install dependencies

You will need to install both Warp Elements and Lit Element which is the library we use for custom elements

```sh
npm install lit @warp-ds/icons
```

#### Import Elements icons

Import elements icons once to use them in the entire app.
Once imported, run your script through whatever bundling process your app uses (Rollup, Esbuild, etc) after which the component can be used in the page.

```js
import '@warp-ds/icons/elements';
```

```html
<w-icon-attachment-16></w-icon-attachment-16>
<w-icon-attachment-24></w-icon-attachment-24>
```

Or import individual icons:
```js
import "@warp-ds/icons/elements/alert-16";
```

```html
<w-icon-alert-16></w-icon-alert-16>
```

## Development

### Install dependencies

Run the following command to install dependencies:

```bash
pnpm install
```

### Adding new icons

When adding icons to @warp-ds/icons follow these steps:

1. Add all the icon files to the correct folder in [src/raw/](https://github.com/warp-ds/icons/tree/next/src/raw) directory. Follow this pattern: `src/raw/{icon-name}/icon_{size}.svg`
2. Add description for the new icons to [default-icon-descriptions.js](https://github.com/warp-ds/icons/blob/next/default-icon-descriptions.js) and run `pnpm i18n:get-sorted-locales` to sort the translations alphabetically. Follow this pattern:
```js
arrowleft: {
  message: "Leftward-pointing arrow", // We only describe what the icon looks like - not what is its potential purpose.
  id: "icon.title.arrow-left", // the last part reflects the name of the folder
  comment: "Title for arrow left icon" // This comment will serve as help for the internationalisation team to provide correct translation of the icon description
},
```
3. Generate locales files and build the icons:
```bash
pnpm build
```

### Local preview
You can open a local preview of the icons. Use this to verify that the icons look as they should. Run the following command:

```bash
pnpm dev
```

### Typescript support

We are bundling types now for all named exports. To make Typescript compiler compliant to these changes you'll need to use `"module": "NodeNext"` in your tsconfig and then all the imports would have types.

## Releases

This project is continuously published to [NPM](https://www.npmjs.com/package/@warp-ds/icons) using a `next` tag (e.g. `1.1.0-next.1`).
Anyone needing to use the latest changes of this package can point to the `next` version while waiting for the stable release.

## Changelog

Detailed changes for each release can be found in the [CHANGELOG](CHANGELOG.md) file.


## License

@warp-ds/icons is available under the [Apache-2.0 software license](https://github.com/warp-ds/react/blob/main/LICENSE).
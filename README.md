# WARP icons
The icon set for WARP, imported from (Figma project)[!https://www.figma.com/file/yEx16ew6S0Xgd579dN4hsM/Warp---Icons?type=design&node-id=150-113&mode=design&t=TRtIuPlsDoYlbuqd-0].

**Note that the icons in the "src/raw" folder in this repository should never be used directly, as they aren't optimized. Also note that Raw icons don't contain title element and hence won't be follow accessibility guidelines**

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

### Updating the icons
Icons should never be added or edited manually in this repository, as the source of truth is in [Figma](https://www.figma.com/file/yEx16ew6S0Xgd579dN4hsM/Warp---Icons?type=design&node-id=150-113&mode=design&t=TRtIuPlsDoYlbuqd-0).

#### Figma access token
If you are running the import script for the first time, it will prompt your for a Figma access token. The token is is required to access Figma's API. It can be generated on your Figma account settings page.

The import script may store the token to a local file, so you won't have to supply the token again on subsequent runs.

### Import script
To update the icons, run the following script. If it has a valid Figma access token ([see previous section](#figma-access-token)), it will proceed to download all the icons as SVG files.

```bash
./scripts/import.js
```

or 

```bash
pnpm import
```

### Local preview
You can open a local preview of the icons. Use this to verify that the icons looks as they should. Run the following command.

```bash
pnpm dev
```

### Typescript support

You can define an 'icons.d.ts' file in your repo and export the types bundled with the package for the correct namespace. Eg for React:

```
declare module '@warp-ds/icons/react' {
    export * from '@warp-ds/icons/dist/types/react'
}
```

## Releases

This project is continuously published to [NPM](https://www.npmjs.com/package/@warp-ds/icons) and [Eik](https://assets.finn.no/pkg/@warp-ds/icons) using a `next` tag (e.g. `1.1.0-next.1`).
Anyone needing to use the latest changes of this package can point to the `next` version while waiting for the stable release.

Eik versions for each of Vue, Elements and React icons that are built to the ./dist folder are automatically published to Eik under the path `https://assets.finn.no/pkg/{name}/{version}/`.

Example Paths:
* React: `https://assets.finn.no/pkg/@warp-ds/icons/v1/react/icons.min.js`
* Vue: `https://assets.finn.no/pkg/@warp-ds/icons/v1/vue/icons.min.js`
* Custom Elements: `https://assets.finn.no/pkg/@warp-ds/icons/v1/elements/icons.min.js`
* Raw ads svg at size 16: `https://assets.finn.no/pkg/@warp-ds/icons/v1/16/ads.svg`
* Raw air con svg at size 24: `https://assets.finn.no/pkg/@warp-ds/icons/v1/24/air-con.svg`


## Changelog

Detailed changes for each release can be found in the [CHANGELOG](CHANGELOG.md) file.


## License

@warp-ds/icons is available under the [Apache-2.0 software license](https://github.com/warp-ds/react/blob/main/LICENSE).
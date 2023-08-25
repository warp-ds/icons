# WARP icons
The icon set for WARP, imported from (Figma project)[!https://www.figma.com/file/yEx16ew6S0Xgd579dN4hsM/Warp---Icons?type=design&node-id=150-113&mode=design&t=TRtIuPlsDoYlbuqd-0].

## Development

### Updating the icons
Icons should never be added or edited manually in this repository, as the source of truth is in (Figma)[!https://www.figma.com/file/yEx16ew6S0Xgd579dN4hsM/Warp---Icons?type=design&node-id=150-113&mode=design&t=TRtIuPlsDoYlbuqd-0].

#### Figma access token
If you are running the import script for the first time, it will prompt your for a Figma access token. The token is is required to access Figma's API. It can be generated on your Figma account settings page.

The import script may store the token to a local file, so you won't have to supply the token again on subsequent runs.

### Import script
To update the icons, run the following script. If it has a valid Figma access token (see above), it will proceed to download all the icons as SVG files.

```bash
./scripts/import.js
```

or 

```bash
pnpm run import
```

### Local preview
You can open a local preview of the icons. Use this to verify that the icons looks as they should. Run the following command.

```bash
pnpm run preview
```



# icon2component

A command-line helper for turning raw SVG files into reusable icon components (or Mui compatible components). It wraps the [`icon2component`](./dist/src/index.js) binary, handling formatting, attribute normalization, and SVGO optimizations so your icons are ready to drop into React projects—whether you prefer plain React components or Material UI wrappers.

## Installation

- Local project (dev dependency): `yarn add @weblite/icon-cli --dev`
- Global tool: `yarn global add @weblite/icon-cli`

The package exposes the `icon2component` executable once installed.

## Getting Started

1. **Add a script to your project**

   Add the following script to your `package.json`:

   ```json
   {
     "scripts": {
       "generate-icons": "node ./dist/src/index.js make --keep-colors --camel-case-attrs --out-dir icons -- svgs"
     }
   }
   ```

2. **Organize your SVG files**

   Create a folder (`svgs/`) in your project root and place all your SVG files there.

3. **Generate icon components**

   Run the script to convert your SVG files into icon components:

   ```bash
   yarn generate-icons
   ```

   This will create the icon components in the `icons/` folder (or the folder specified by `--out-dir`).

## Usage

Run the CLI from the root of a project that contains an `svgs/` directory with your source assets:

```bash
icon2component make \
  --keep-colors \
  --camel-case-attrs \
  --out-dir icons \
  -- svgs
```

### Common flags

- `--keep-colors` preserves fill and stroke definitions from the source SVG.
- `--camel-case-attrs` converts attributes like `fill-rule` to `fillRule` for React.
- `--template mui` switches to the bundled Material UI wrapper template. Omit the flag to emit plain React components.
- `--out-dir <path>` controls the folder where generated components are written (defaults to `icons`).
- `--help` shows the full command reference.

All flags map directly to the underlying `yargs` command configuration, so you can combine them as needed.

## Project Scripts

- `yarn build` – compile TypeScript into `dist/`.
- `yarn make` – run the CLI locally using the current build output.
- `yarn pub` – publish to the configured npm registry (runs `build` first).

## Development

1. Install dependencies: `yarn install`.
2. Make changes under `src/`.
3. Run `yarn build` to regenerate the distribution files.
4. Test the CLI locally: `node dist/src/index.js make --help`.

> The repo ignores `dist/` and `exec/` until you build locally. Publishing requires both directories to exist.

## License

ISC © Mohammad Farvardin

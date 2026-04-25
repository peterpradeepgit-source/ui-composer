# Release Checklist

Use this when you want a clean pause-point review or are getting ready to publish a new package version.

## Core Verification

- Run `npm test`
- Run `npm run lint`
- Run `npm run build`
- Open the local demo with `npm run dev`

## Product Smoke Test

- Add a few built-in components to the canvas
- Reorder components with drag and drop
- Edit a few properties in the right panel
- Confirm undo and redo still work
- Save JSON and load it back
- Export a TSX component and check the file output
- Export a runnable app and confirm the generated project looks complete

## Package Readiness

- Confirm `README.md` matches the current feature set
- Confirm `package.json` version is correct
- Confirm public exports still match the intended API surface
- Confirm `LICENSE` is included
- Confirm `dist/` is regenerated from the latest source before publishing

## Nice To Have

- Capture one updated screenshot or short GIF for the README
- Test package install in a fresh sample app
- Skim the generated declaration files for obvious export mistakes

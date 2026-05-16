# CourtListener Copy Citation

A small browser extension that lets you select opinion text on CourtListener and copy either:

- a formatted citation with pincite
- the selected text followed by a formatted citation with pincite

The extension runs only on CourtListener opinion pages and does not send data to any server.

## Development

```sh
npm install
npm test
npm run build
```

The built extension is written to `dist/`.

## Release

```sh
npm test
npm run package
npm run lint:firefox
```

Upload these generated packages:

- Chrome Web Store: `release/courtlistener-copy-citation-v1.0.0-chrome.zip`
- Firefox Add-ons: `release/courtlistener-copy-citation-v1.0.0-firefox.zip`

Use unlisted distribution in each store if the extension should be installable by link but not searchable in the public catalog.

## Privacy

See [PRIVACY.md](PRIVACY.md).

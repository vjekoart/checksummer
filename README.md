# Checksummer

Small client-side web app that calculates SHA256 checksum of a given file.

## Environment

Built with Next.js v13.5.3 on NodeJS v20.7.0.

## Build & deployment

```
$ npm install
$ npm run build

# Do something with the `.next` folder.
```

## Development

```
$ npm install
$ npm run dev
```

## Running tests

```
# Make sure that Playwright dependencies are installed
$ npx playwright install-deps

# Ensure that latest version of the app is built and server is started
$ npm run build && npm run start

# Run both E2E and unit tests
$ npm run test
```

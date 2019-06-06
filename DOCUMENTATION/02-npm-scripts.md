# npm scripts

This wiki page details the available npm scripts. These scripts are located in the `scripts` category of [`/package.json`](../package.json).

Keep in mind that this documentation uses the `yarn` command but **using `npm` instead will have the same effect**.

## Summary

 - [`server:start`](#serverstart)
 - [`server:start:no-delete-extracts`](#serverstartno-delete-extracts)
 - [`server:lint`](#serverlint)
 - [`app:dev`](#appdev)
 - [`app:build`](#appbuild)
 - [`app:lint`](#applint)
 - [`doc`](#doc)
 - [`test`](#test)

---

## `server:start`
Start the server with the extract remover service.
```sh
yarn server:start
```

## `server:start:no-delete-extracts`
Start the server without the extract remover service.
```sh
yarn server:start
```

## `server:lint`
Lint and autofix the server files.

This will follow the [`/.eslintrc.js`](../.eslintrc.js) ESLint configuration. It will warn you for syntax misuse, indentation errors or such.
```sh
yarn server:lint
```

## `app:dev`
Start the web application on an hot-reload server. Development mode only. Do not use in production as it is less performant and not optimized
```sh
yarn app:dev
```

## `app:build`
Build the web application files to the `/dist` directory. Generated files (HTML/CSS/JavaScript) are optimized for production.
```sh
yarn app:build
```

## `app:lint`
Lint and autofix the web application files.

This will follow the [`/.eslintrc.js`](../.eslintrc.js) ESLint configuration. It will warn you for syntax misuse, indentation errors or such.
```sh
yarn app:lint
```

## `doc`
Generate the API documentation to the `/doc` directory. When starting the server, this documentation will be available at `/doc` url.
```sh
yarn doc
```

## `test`
Run the API automated tests. It will check for routes and database errors.

These tests are automatically ran when using Docker.
```sh
yarn test
```

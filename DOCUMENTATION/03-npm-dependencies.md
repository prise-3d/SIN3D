# npm dependencies

This wiki page details the npm dependencies. These dependencies are located in `dependencies` and `devDependencies`categories of [`/package.json`](../package.json).

## Summary

 - [Production dependencies](#production-dependencies)
 - [Development dependencies](#development-dependencies)

---

## Production dependencies
These dependencies are mostly used by the server.

| Name | Link | Description |
| --- | --- | --- |
| `@hapi/boom` | [npm](https://www.npmjs.com/package/@hapi/boom) | Better API HTTP errors |
| `body-parser` | [npm](https://www.npmjs.com/package/body-parser) | Parse HTTP request body |
| `compression` | [npm](https://www.npmjs.com/package/compression) | Turn HTTP server's gzip compression on |
| `core-js` | [npm](https://www.npmjs.com/package/core-js) | Dependency of Babel (in `@vue/cli-service`) |
| `cors` | [npm](https://www.npmjs.com/package/cors) | Turn Cross-Origin Resource Sharing (CORS) HTTP header on |
| `cron` | [npm](https://www.npmjs.com/package/cron) | Cron integrated in Node.js, used for the extracts remover service |
| `esm` | [npm](https://www.npmjs.com/package/esm) | Node.js JavaScript module loader. Used for the server |
| `express` | [npm](https://www.npmjs.com/package/express) | API framework |
| `helmet` | [npm](https://www.npmjs.com/package/helmet) | Turn security-related HTTP headers on |
| `mongoose` | [npm](https://www.npmjs.com/package/mongoose) | MongoDB database driver |
| `morgan` | [npm](https://www.npmjs.com/package/morgan) | API logger |
| `serve-static` | [npm](https://www.npmjs.com/package/serve-static) | Serve and cache images |
| `sharp` | [npm](https://www.npmjs.com/package/sharp) | Node.js image processing library |
| `ua-parser-js` | [npm](https://www.npmjs.com/package/ua-parser-js) | Parse User Agent strings |
| `winston` | [npm](https://www.npmjs.com/package/winston) | Server logger |
| `ws` | [npm](https://www.npmjs.com/package/ws) | Node.js WebSockets server |

## Development dependencies
These dependencies are here for developers only. They contain the web application setup, optimized builders and API automated tests. It also contains API documentation generator and `ESLint` with its plugins.

When the web application files are builded, `Vue.js` and its plugins are not necessary. In fact, the build output will contain portable HTML, CSS and JavaScript.

| Name | Link | Description |
| --- | --- | --- |
| `@vue/cli-plugin-babel` | [npm](https://www.npmjs.com/package/@vue/cli-plugin-babel) | Just a plugin to use `ESLint` with latest JavaScript features |
| `@vue/cli-plugin-eslint` | [npm](https://www.npmjs.com/package/@vue/cli-plugin-eslint) | Just a plugin to use `ESLint` with `Vue.js` |
| `@vue/cli-service` | [npm](https://www.npmjs.com/package/@vue/cli-service) | Hot-reload development `Vue.js` development server. Builds and optimize files for production |
| `@vue/eslint-config-standard` | [npm](https://www.npmjs.com/package/@vue/eslint-config-standard) | A base configuration for `ESLint` |
| `apidoc` | [npm](https://www.npmjs.com/package/apidoc) | API documentation generator |
| `ava` | [npm](https://www.npmjs.com/package/ava) | Automated tests |
| `babel-eslint` | [npm](https://www.npmjs.com/package/babel-eslint) | Just a plugin to use `ESLint` with latest JavaScript features |
| `deepmerge` | [npm](https://www.npmjs.com/package/deepmerge) | Merge JavaScript objects into one unique object. Used for the configuration system |
| `eslint` | [npm](https://www.npmjs.com/package/eslint) | JavaScript code linter. Will warn you for syntax misuse, indentation errors or such  |
| `eslint-plugin-vue` | [npm](https://www.npmjs.com/package/eslint-plugin-vue) | Just a plugin to use `ESLint` with `Vue.js` |
| `fs-extra` | [npm](https://www.npmjs.com/package/fs-extra) | Better file system library than Node.js native one. Used in automated tests |
| `material-design-icons-iconfont` | [npm](https://www.npmjs.com/package/material-design-icons-iconfont) | Web application icons |
| `stylus` | [npm](https://www.npmjs.com/package/stylus) | Scriptable CSS, used by `Vuetify` |
| `stylus-loader` | [npm](https://www.npmjs.com/package/stylus-loader) | Build stylus-styles files, used by `Vuetify` |
| `supertest` | [npm](https://www.npmjs.com/package/supertest) | HTTP requests test library |
| `vue` | [npm](https://www.npmjs.com/package/vue) | `Vue.js` JavaScript framework |
| `vue-cli-plugin-vuetify` | [npm](https://www.npmjs.com/package/vue-cli-plugin-vuetify) | Just a plugin to use `Vuetify` in `Vue.js` |
| `vue-native-websocket` | [npm](https://www.npmjs.com/package/vue-native-websocket) | WebSockets client library, plugged to `Vuex` |
| `vue-router` | [npm](https://www.npmjs.com/package/vue-router) | Web application routing system |
| `vue-template-compiler` | [npm](https://www.npmjs.com/package/vue-template-compiler) | Build `Vue.js` `.vue` files |
| `vuetify` | [npm](https://www.npmjs.com/package/vuetify) | `Vue.js` specific CSS framework |
| `vuetify-loader` | [npm](https://www.npmjs.com/package/vuetify-loader) | Load `Vuetify` |
| `vuex` | [npm](https://www.npmjs.com/package/vuex) | `Vue.js` global store |
| `vuex-persist` | [npm](https://www.npmjs.com/package/vuex-persist) | Persist global store in browser's cache, used to save configuration and progression data |
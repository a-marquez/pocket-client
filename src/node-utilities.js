/* eslint-disable no-multi-assign, brace-style */
const {readFile} = require('fs')
const {promisify} = require('util')

const self = module.exports = {
  hotRequire: modulePath => {
    delete require.cache[require.resolve(modulePath)]
    return require(modulePath)
  },

  // note: intended for use with koa
  hotRouteLoad: routePath => {
    return async (ctx, next) => {
      return self.hotRequire(routePath)(ctx, next)
    }
  },

  consoleClear: () => {process.stdout.write('\u001Bc')},

  readFilePromised: () => {return promisify(readFile)},

  stringifyPretty: value => {return JSON.stringify(value, null, 2)}
}
/* eslint-enable */

const {readFile} = require('fs')
const {promisify} = require('util')

const self = module.exports = {
  hotRequire: (modulePath) => {
    delete require.cache[require.resolve(modulePath)]
    return require(modulePath)
  },

  // note: intended for use with koa
  hotRouteLoad: (routePath) => {
    return async (ctx, next) => {
      return self.hotRequire(routePath)(ctx, next)
    }
  },

  consoleClear: () => {process.stdout.write('\033c')},

  readFilePromised: () => {return promisify(readFile)},

  stringifyPretty: (_) => {return JSON.stringify(_, null, 2)}
}

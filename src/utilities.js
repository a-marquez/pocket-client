const self = module.exports = {
  hotRequire: (modulePath) => {
    delete require.cache[require.resolve(modulePath)]
    return require(modulePath)
  },

  hotRouteLoad: (routePath) => {
    return async (ctx) => {
      return self.hotRequire(routePath)(ctx)
    }
  },

  stringifyPretty: (_) => {return JSON.stringify(_, null, 2)}
}

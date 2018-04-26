export const domainRegex = /(?:https?)?(?::\/\/)?(?:www\.)?([\w\.]+)/
export function log(_) {
  console.log(_); return _
}
export function debug(_) {
  return _
}
export function bindClassFns(context, classFnNames) {
  classFnNames.forEach(fnName => {
    context[fnName] = context[fnName].bind(context)
  })
}
export function getUnixEpoch() {
  return Math.floor(new Date() / 1000)
}

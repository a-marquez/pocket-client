export const domainRegex = /(?:https?)?(?::\/\/)?(?:www\.)?([\w\.]+)/
export function log(_) {console.log(_); return _}
export function debug(_) {debugger; return _}
export function bindClassFns(context, classFnNames) {classFnNames.forEach((fnName) => {context[fnName] = context[fnName].bind(context)})}

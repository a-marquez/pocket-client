const {stringifyPretty} = require('../node-utilities')

module.exports = async ctx => {
  ctx.body = `
    <b>Cookie:</b>
    <pre>${stringifyPretty(ctx.session)}</pre>
  `
}

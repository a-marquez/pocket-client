const config = require('../server-config')
const pocket = require('../pocket-api')

module.exports = async ctx => {
  if (ctx.session.is_authenticated === false) {
    ctx.throw(401, 'Lacking pocket authentication')
  } else {
    const response_json = await pocket.sendData(config.pocket_consumer_key, ctx.session.pocket_access_token, JSON.parse(ctx.request.query.actions))
    ctx.set('Content-Type', 'application/json')
    ctx.body = JSON.stringify(response_json)
  }
}

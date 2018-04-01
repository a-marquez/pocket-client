const config = require('../server-config')
const pocket = require('../pocket-api')

module.exports = async (ctx) => {
  ctx.body = 'Completing authentication and launching application...'
  const response_json = await pocket.getAccessToken(config.pocket_consumer_key, ctx.session.pocket_request_token)
  ctx.session.pocket_access_token = response_json.access_token
  ctx.session.pocket_username = response_json.username
  ctx.session.is_authenticated = true
  ctx.redirect('/')
}

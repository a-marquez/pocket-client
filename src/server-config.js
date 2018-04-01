const env = JSON.parse(JSON.stringify(process.env))
module.exports = {
  secret: env.GENERAL_SALT,
  pocket_consumer_key: env.POCKET_CONSUMER_KEY,
  pocket_redirect_uri: 'localhost:8080/success',
  session: {
    key: 'koa:sess',
    number: '60000', // 1 minute expiration, persists on browser close
    // session: '60000', // 1 minute expiration, doesn't persist on browser close
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false
  }
}

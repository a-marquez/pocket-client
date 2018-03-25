const fs = require('fs')
const https = require('https')
const Koa = require('koa')
const _ = require('koa-route')
const session = require('koa-session')
const static = require('koa-static')

const {hotRouteLoad} = require('./utilities')
const config = require('./config')
const pocket = require('./pocket-api')

const serverOptions = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
}

const app = new Koa()

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

// logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
})

// session
app.keys = [process.env.GENERAL_SALT]
app.use(session(config.session, app))

// update cookie
app.use(async (ctx, next) => {
  if (ctx.path !== '/favicon.ico') {
    const views = ctx.session.views || 0
    ctx.session.views = views + 1
  }
  ctx.session.is_authenticated = ctx.session.is_authenticated || false
  await next()
})

// debug
app.use(_.get('/debug', async (ctx) => {
  ctx.body = `<b>Cookie:</b><pre>\n${JSON.stringify(ctx.session, null, '\t')}</pre>`
}))

app.use(_.get('/', hotRouteLoad('./routes/index')))
app.use(_.get('/success', hotRouteLoad('./routes/success')))
app.use(_.get('/pocket-data', hotRouteLoad('./routes/pocket-data')))
app.use(static('./src/public'))

https.createServer(serverOptions, app.callback()).listen(8080)
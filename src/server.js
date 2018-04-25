const fs = require('fs')
const http = require('http')
const Koa = require('koa')
const _ = require('koa-route')
const session = require('koa-session')
const stylus = require('koa-stylus-parser')
const static = require('koa-static')

const {hotRouteLoad} = require('./node-utilities')
const config = require('./server-config')
const pocket = require('./pocket-api')

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
app.keys = [config.secret]
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
app.use(_.get('/debug', hotRouteLoad('./routes/debug')))

app.use(_.get('/', hotRouteLoad('./routes/index')))
app.use(_.get('/success', hotRouteLoad('./routes/success')))
app.use(_.get('/pocket-get', hotRouteLoad('./routes/pocket-get')))
app.use(_.get('/pocket-send', hotRouteLoad('./routes/pocket-send')))
app.use(_.get('/logout', hotRouteLoad('./routes/logout')))
app.use(stylus('./src/public', {use: [require('normalize.css.styl')(), require('stylus-case')()]}))
app.use(static('./src/public', {defer: true}))
app.use(static('./build/'))

http.createServer(app.callback()).listen(8080)
console.log('server listening on port 8080')

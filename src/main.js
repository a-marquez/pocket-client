const fs = require('fs')
const https = require('https')
const Koa = require('koa')
const _ = require('koa-route')
const session = require('koa-session')

const config = require('./config')
const pocket = require('./pocket-api')

const server_options = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
}

const app = new Koa()

async function getRequestToken(consumer_key) {
  const authentication_request_url = 'https://getpocket.com/v3/oauth/request'
  const authentication_json_data = JSON.stringify({
    'consumer_key': '75782-df4d855950c5ef988595519f',
    'redirect_uri': 'localhost:8080/success'
  })
  const authentication_request_options = {
    method: 'POST',
    body: authentication_json_data,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Accept': 'application/json'
    }
  }

  const response = await fetch(authentication_request_url, authentication_request_options)
  const response_json = await response.json()
  return response_json
}

async function getAccessToken(request_token) {
  const authentication_request_url = 'https://getpocket.com/v3/oauth/authorize'
  const authentication_json_data = JSON.stringify({
    'consumer_key': '',
    'code': request_token
  })
  const authentication_request_options = {
    method: 'POST',
    body: authentication_json_data,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Accept': 'application/json'
    }
  }

  const response = await fetch(authentication_request_url, authentication_request_options)
  const response_json = await response.json()
  return response_json
}

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
app.use(_.get('/', async (ctx, next) => {
  if (ctx.path !== '/favicon.ico') {
    const views = ctx.session.views || 0
    ctx.session.views = views + 1
  }
  ctx.session.is_authenticated = ctx.session.is_authenticated || false
  await next()
}))

// debug
app.use(_.get('/debug', async (ctx) => {
  ctx.body = `<b>Cookie:</b><pre>\n${JSON.stringify(ctx.session, null, '\t')}</pre>`
}))

// home
app.use(_.get('/', async (ctx) => {
  if (ctx.session.is_authenticated === false) {
    const response_json = await pocket.getRequestToken(config.pocket_consumer_key, config.pocket_redirect_uri)
    const authentication_url = `https://getpocket.com/auth/authorize?request_token=${response_json.code}&redirect_uri=https://localhost:8080/success`
    const template = `<a href='${authentication_url}'>${authentication_url}</a>`
    ctx.session.pocket_request_token = response_json.code
    ctx.body = template
  } else {
    ctx.body = `
      <div>Authenticated <b>${ctx.session.pocket_username}</b></div>
      <button>logout</button>
      <div>data</div>
    `
  }
}))

// success
app.use(_.get('/success', async (ctx) => {
  ctx.body = 'Completing authentication and launching application...'
  const response_json = await getAccessToken(ctx.session.pocket_request_token)
  ctx.session.pocket_access_token = response_json.access_token
  ctx.session.pocket_username = response_json.username
  ctx.session.is_authenticated = true
  ctx.redirect('/')
}))

https.createServer(server_options, app.callback()).listen(8080)

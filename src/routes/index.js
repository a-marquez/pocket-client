const config = require('../config')
const pocket = require('../pocket-api')

module.exports = async (ctx) => {
  if (ctx.session.is_authenticated === false) {
    const response_json = await pocket.getRequestToken(config.pocket_consumer_key, config.pocket_redirect_uri)
    const authentication_url = `https://getpocket.com/auth/authorize?request_token=${response_json.code}&redirect_uri=https://localhost:8080/success`
    ctx.session.pocket_request_token = response_json.code
    ctx.body = `
      <div>Unauthenticated</div>
      <a href='${authentication_url}'><button>Login</button></a>
    `
  } else {
    const response_json = await pocket.getData(config.pocket_consumer_key, ctx.session.pocket_access_token, {count: 10, detailType: 'complete'})
    ctx.body = `
<!doctype html>
<html>
  <head>
    <meta charset='utf-8'>
    <meta http-equiv='x-ua-compatible' content='ie=edge'>
    <title>Pocket Client</title>
    <meta name='description' content='Pocket Client'>
    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
    <link rel='stylesheet' href='./css/main.css'>
  </head>
  <body>
    <div class='flex flex-column fill'>
      <header class='padding text-white back-blue--1'>
        <div>Authenticated <b>${ctx.session.pocket_username}</b></div>
        <button onclick='localStorage.clear(); document.location.href="/logout"'>Logout</button>
        <button onclick='localStorage.clear()'>Clear cached Pocket data</button>
      </header>
      <div id='root' class='flex-grow-1 relative'></div>
    </div>
    <script src="https://fb.me/react-15.0.0.js"></script>
    <script src="https://fb.me/react-dom-15.0.0.js"></script>
    <script src="https://unpkg.com/babel-standalone@6.26.0/babel.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flux/3.1.3/Flux.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flux/3.1.3/FluxUtils.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/ramda/0.25.0/ramda.js"></script>
    <script type='text/babel' src='./js/main.js'></script>
  </body>
</html>
    `
  }
}

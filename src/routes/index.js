const config = require('../config')
const pocket = require('../pocket-api')

module.exports = async (ctx) => {
  if (ctx.session.is_authenticated === false) {
    const response_json = await pocket.getRequestToken(config.pocket_consumer_key, config.pocket_redirect_uri)
    const authentication_url = `https://getpocket.com/auth/authorize?request_token=${response_json.code}&redirect_uri=https://localhost:8080/success`
    ctx.session.pocket_request_token = response_json.code
    ctx.body = `
      <link rel='stylesheet' href='./css/main.css'>
      <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre.min.css">
      <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre-exp.min.css">
      <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre-icons.min.css">
      <body style='overflow: hidden;'>
        <header class='padding text-white back-blue--1'>
          <div class='relative'>
            <div class='absolute fill__horizontal'>
              <a href='${authentication_url}'>
                <button class='btn btn-sm btn-primary float-right'>Login</button>
              </a>
            </div>
            <div><h4>Pocket Client</h4></div>
          <div>
        </header>
        <div class='empty fill__vertical'>Please <a href='${authentication_url}'>login</a>.</div>
      </body>
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
    <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre.min.css">
    <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre-exp.min.css">
    <link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre-icons.min.css">
  </head>
  <body>
    <div class='flex flex-column fill'>
      <header class='padding text-white back-blue--1'>
        <div class='relative'>
          <div class='absolute fill__horizontal'>
            <button class='btn btn-sm btn-primary float-right' onclick='localStorage.clear(); document.location.href="/logout"'>Logout</button>
          </div>
          <div><h4>Pocket Client</h4></div>
          <div>Welcome, <b>${ctx.session.pocket_username}</b></div>
        <div>
      </header>
      <div id='root' class='flex-grow-1 relative' style='display: none;'></div>
      <div id='root2' class='flex-grow-1 relative'></div>
      <script src='./js/main2.js'></script>
    </div>
` +
    // <script src="https://fb.me/react-15.0.0.js"></script>
    // <script src="https://fb.me/react-dom-15.0.0.js"></script>
    // <script src="https://unpkg.com/babel-standalone@6.26.0/babel.min.js"></script>
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/flux/3.1.3/Flux.min.js"></script>
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/flux/3.1.3/FluxUtils.min.js"></script>
    // <script src="//cdnjs.cloudflare.com/ajax/libs/ramda/0.25.0/ramda.js"></script>
    // <script type='text/babel' src='./js/main.js'></script>
`
  </body>
</html>
    `
  }
}

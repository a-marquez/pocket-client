const fetch = require('node-fetch')

const config = {
  request_token_url: 'https://getpocket.com/v3/oauth/request',
  access_token_url: 'https://getpocket.com/v3/oauth/authorize'
}

module.exports = {
  getRequestToken: async (consumer_key, redirect_uri) => {
    const response = await fetch(config.request_token_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Accept': 'application/json'
      },
      body: JSON.stringify({consumer_key, redirect_uri})
    })
    return await response.json()
  },
  getAccessToken: (consumer_key) => {},
}

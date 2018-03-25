const fetch = require('node-fetch')
const assignRequestOptions = (additionalOptions) => {
  return Object.assign({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Accept': 'application/json'
    }
  }, additionalOptions)
}

module.exports = {
  getRequestToken: async (consumer_key, redirect_uri) => {
    const response = await fetch('https://getpocket.com/v3/oauth/request', assignRequestOptions({
      body: JSON.stringify({consumer_key, redirect_uri})
    }))
    return await response.json()
  },
  getAccessToken: async (consumer_key, request_token) => {
    const response = await fetch('https://getpocket.com/v3/oauth/authorize', assignRequestOptions({
      body: JSON.stringify({consumer_key, code: request_token})
    }))
    return await response.json()
  },
  getData: async (consumer_key, access_token, options) => {
    const response = await fetch('https://getpocket.com/v3/get', assignRequestOptions({
      body: JSON.stringify({consumer_key, access_token, ...options})
    }))
    return await response.json()
  }
}

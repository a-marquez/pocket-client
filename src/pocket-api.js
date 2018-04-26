const fetch = require('node-fetch')

const baseRequestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Accept': 'application/json'
  }
}

/* eslint-disable camelcase */
module.exports = {
  getRequestToken: async (consumer_key, redirect_uri) => {
    const response = await fetch('https://getpocket.com/v3/oauth/request', {
      ...baseRequestOptions,
      body: JSON.stringify({consumer_key, redirect_uri})
    })
    return response.json()
  },
  getAccessToken: async (consumer_key, request_token) => {
    const response = await fetch('https://getpocket.com/v3/oauth/authorize', {
      ...baseRequestOptions,
      body: JSON.stringify({consumer_key, code: request_token})
    })
    return response.json()
  },
  getData: async (consumer_key, access_token, options) => {
    const response = await fetch('https://getpocket.com/v3/get', {
      ...baseRequestOptions,
      body: JSON.stringify({consumer_key, access_token, ...options})
    })
    return response.json()
  },
  sendData: async (consumer_key, access_token, actions) => {
    const response = await fetch('https://getpocket.com/v3/send', {
      ...baseRequestOptions,
      body: JSON.stringify({consumer_key, access_token, actions})
    })
    return response.json()
  }
}

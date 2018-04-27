// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime/runtime'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {combineReducers, createStore, applyMiddleware} from 'redux'
import logger from 'redux-logger'

import * as reducers from './reducers'
import {initialState} from './fixtures'
import App from './components/app'
import {retrieveItems} from './actions'

const reduxApp = combineReducers(reducers)
const store = createStore(
  reduxApp,
  initialState,
  applyMiddleware(logger)
)

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)

store.dispatch(retrieveItems({
  detailType: 'complete',
  state: 'all',
  count: 2
}))

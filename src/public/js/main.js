// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime/runtime'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {combineReducers, createStore, applyMiddleware} from 'redux'
// import logger from 'redux-logger'
import thunk from 'redux-thunk'

import * as reducers from './reducers'
// import initialState from './fixtures/initial-state'
import App from './components/app'
import {retrieveItemsThunk} from './actions'

const reduxApp = combineReducers(reducers)
const store = createStore(
  reduxApp,
  // initialState,
  applyMiddleware(
    thunk,
    // logger
  )
)

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)

store.dispatch(retrieveItemsThunk({
  detailType: 'complete',
  state: 'all',
  offset: 30,
  count: 10
}))

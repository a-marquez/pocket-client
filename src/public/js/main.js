// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime/runtime'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {combineReducers, createStore, applyMiddleware} from 'redux'
import logger from 'redux-logger'

import reducers from './reducers'
import ReduxApp from './components/redux-app'

const reduxApp = combineReducers(reducers)
const store = createStore(
  reduxApp,
  applyMiddleware(logger)
)

render(
  <Provider store={store}>
    <ReduxApp/>
  </Provider>,
  document.getElementById('root')
)

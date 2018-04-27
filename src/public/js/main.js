// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime/runtime'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {combineReducers, createStore, applyMiddleware} from 'redux'
import logger from 'redux-logger'

import * as reducers from './reducers'
import {initialState} from './fixtures'
import ReduxApp from './components/redux-app'
import {retrieveItems} from './actions'

const reduxApp = combineReducers(reducers)
const store = createStore(
  reduxApp,
  initialState,
  applyMiddleware(logger)
)

render(
  <Provider store={store}>
    <ReduxApp/>
  </Provider>,
  document.getElementById('root')
)

store.dispatch(retrieveItems({}))

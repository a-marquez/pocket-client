import {combineReducers} from 'redux'
import {equals, reject, append, contains, compose as c} from 'ramda'

import {actionTypes} from './actions'

const rejectEquals = c(reject, equals)

const items = (state = {}, action) => {
  const {options, status, response} = action
  switch (action.type) {
    case (actionTypes.RETRIEVE_ITEMS):
      return {
        ...state,
        4: {id: 4, title: 'CodePen', url: 'https://codepen.io', tags: [2]}
      }
    default: {
      return state
    }
  }
}

const tags = (state = {}) => {
  return state
}

export const entities = combineReducers({items, tags})

export const activeTags = (state = [], action) => {
  const {id} = action
  switch (action.type) {
    case (actionTypes.TOGGLE_TAG):
      return (contains(id, state) ? rejectEquals : append)(id)(state)
    default: {
      return state
    }
  }
}

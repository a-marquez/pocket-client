import {combineReducers} from 'redux'
import {equals, reject, append, contains, compose as c} from 'ramda'
import {camelizeKeys} from 'humps'
import {normalize} from 'normalizr'

import {actionTypes} from './actions'
import {retrieveItemsSchema} from './schemata'

const rejectEquals = c(reject, equals)
const normalizeBySchema = schema => input => normalize(input, schema)
const normalizeItems = c(normalizeBySchema(retrieveItemsSchema), camelizeKeys)

const items = (state = {}, action) => {
  const {response} = action
  switch (action.type) {
    case (actionTypes.RETRIEVE_ITEMS):
      if (response && response.error) {
        console.error(response.error)
      } else if (response) {
        return {
          ...state,
          ...normalizeItems(response).entities.items
        }
      }
      return state
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

import fetch from 'cross-fetch'
import Enum from 'es6-enum'
import {paramateriseObject} from './ramda-utilities'

// action types
export const actionTypes = new Enum(
  'TOGGLE_TAG',
  'RETRIEVE_ITEMS'
  // 'UPDATE_ITEMS'
  // 'DELETE_ITEMS'
)

// other constants
export const contentTypes = new Enum(
  'ARTICLE',
  'VIDEO',
  'IMAGE'
)

// action creators
export function toggleTag(id) {
  return {type: actionTypes.TOGGLE_TAG, id}
}

function retrieveItems(options, response) {
  return {
    type: actionTypes.RETRIEVE_ITEMS,
    options,
    response
  }
}

export function retrieveItemsThunk(options) {
  return function (dispatch) {
    dispatch(retrieveItems(options))
    return fetch(
      `http://localhost:8080/pocket-get?${paramateriseObject(options)}`,
      {credentials: 'same-origin'}
    )
      .then(
        response => response.json(),
        console.error
      )
      .then(json => dispatch(retrieveItems(options, json)))
  }
}

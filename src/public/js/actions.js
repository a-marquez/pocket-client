import Enum from 'es6-enum'

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

export function retrieveItems(options, status, response) {
  return {
    type: actionTypes.RETRIEVE_ITEMS,
    options,
    status,
    response
  }
}

// action types
export const TOGGLE_TAG = 'TOGGLE_TAG'

// other constants
export const contentTypes = {
  ARTICLE: 'article',
  VIDEO: 'video',
  IMAGE: 'image'
}

// action creators
export function toggleTag(id) {
  return {type: TOGGLE_TAG, id}
}

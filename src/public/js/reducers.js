import {equals, reject, append, contains, compose as c} from 'ramda'

import {TOGGLE_TAG} from './actions'

const rejectEquals = c(reject, equals)

export const initialState = {
  entitites: {
    items: {
      1: {
        id: 1,
        title: 'Google',
        url: 'https://google.com',
        tags: [1, 2, 3]
      },
      2: {
        id: 2,
        title: 'StackOverflow',
        url: 'https://stackoverflow.com',
        tags: [1]
      },
      3: {
        id: 3,
        title: 'Github',
        url: 'https://github.com',
        tags: [3]
      }
    },
    tags: {
      1: {
        id: 1,
        name: 'javascript'
      },
      2: {
        id: 2,
        name: 'css'
      },
      3: {
        id: 3,
        name: 'html'
      }
    }
  },
  activeTags: []
}

const tags = (state = initialState.entitites.tags) => {
  return state
}

const items = (state = initialState.entitites.items) => {
  return state
}

const activeTags = (state = [], action) => {
  const {id} = action
  switch (action.type) {
    case (TOGGLE_TAG):
      return (contains(id, state) ? rejectEquals : append)(id)(state)
    default: {
      return state
    }
  }
}

export default {tags, items, activeTags}

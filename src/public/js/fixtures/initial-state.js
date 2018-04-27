const initialState = {
  entities: {
    items: {
      1: {
        id: 1,
        title: 'Google',
        url: 'https://google.com',
        tags: ['javascript']
      },
      2: {
        id: 2,
        title: 'StackOverflow',
        url: 'https://stackoverflow.com',
        tags: ['css']
      },
      3: {
        id: 3,
        title: 'Github',
        url: 'https://github.com',
        tags: []
      }
    },
    tags: {
      'javascript': {
        id: 'javascript',
        name: 'javascript'
      },
      'css': {
        id: 'css',
        name: 'css'
      }
    }
  },
  activeTags: [],
  lastUpdated: 0 // unix epoch
}
export default initialState

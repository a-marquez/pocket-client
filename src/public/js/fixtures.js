export const initialState = {
  entities: {
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


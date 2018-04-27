import React from 'react'
import FilteredItemList from '../containers/filter-item-list'
import ConnectedTagList from '../containers/connected-tag-list'

const App = () => (
  <div className='absolute flex flex-column fill'>
    <ConnectedTagList/>
    <FilteredItemList/>
  </div>
)

export default App

import React from 'react'
import ActiveTag from '../containers/active-tag'

const TagList = ({tags, onClick}) => (
  <div className='tags-container margin'>
    {Object.values(tags).map(tag => (
      <ActiveTag key={tag.id} {...tag} onClick={() => onClick(tag.id)}/>
    ))}
  </div>
)

export default TagList

import React from 'react'
import Item from './item'

export default ({items}) => (
  <div>
    {Object.values(items).map(item => (
      <Item key={item.id} {...item}/>
    ))}
  </div>
)

import React from 'react'
import Item from './item'

const ItemList = ({items}) => (
  <div className='flex-grow-1 overflow-auto margin__horizontal margin__bottom fill__vertical'>
    <div className='item-container overflow-auto fill__vertical back-white'>
      {Object.values(items).map(item => (
        <Item key={item.id} {...item}/>
      ))}
    </div>
  </div>
)

export default ItemList

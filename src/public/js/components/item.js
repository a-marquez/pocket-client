import React from 'react'

const Item = ({title, url}) => (
  <div className='padding--small'>
    {title} {url}
  </div>
)

export default Item

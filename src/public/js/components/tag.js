import React from 'react'

const Tag = ({onClick, name, active}) => (
  <button type='button' onClick={onClick} className={`btn btn-sm ${active ? 'btn-primary' : ''}`}>
    {name}
  </button>
)

export default Tag

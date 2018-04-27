import React from 'react'

export default ({onClick, name, active}) => (
  <button type='button' onClick={onClick} className={`btn btn-sm ${active ? 'btn-primary' : ''}`}>
    {name}
  </button>
)


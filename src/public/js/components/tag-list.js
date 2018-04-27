import React from 'react'
import {connect} from 'react-redux'
import ActiveTag from '../containers/active-tag'

const TagList = ({tags, onClick}) => (
  <div>
    {Object.values(tags).map(tag => (
      <ActiveTag key={tag.id} {...tag} onClick={() => onClick(tag.id)}/>
    ))}
  </div>
)

const mapState = state => ({tags: state.tags})

export default connect(mapState)(TagList)

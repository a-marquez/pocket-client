import {connect} from 'react-redux'

import Tag from '../components/tag'
import {toggleTag} from '../actions'

const mapState = (state, ownProps) => ({
  active: state.activeTags.includes(ownProps.id)
})

const mapDispatch = (dispatch, ownProps) => ({
  onClick: () => dispatch(toggleTag(ownProps.id))
})

export default connect(
  mapState,
  mapDispatch
)(Tag)

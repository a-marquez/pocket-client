import {connect} from 'react-redux'
import TagList from '../components/tag-list'

const mapState = state => ({tags: state.entities.tags})

export default connect(mapState)(TagList)

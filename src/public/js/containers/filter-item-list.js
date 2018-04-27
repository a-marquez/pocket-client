import {connect} from 'react-redux'
import {map, filter, any, contains, prop, __, compose as c} from 'ramda'
import ItemList from '../components/item-list'

const anyT = any(_ => _ === true)

export const getFilteredItems = (items, activeTags) => {
  if (activeTags.length === 0) {
    return items
  }
  return (
    filter(
      c(
        anyT,
        map(contains(__, activeTags)),
        prop('tags'),
      )
    )(items)
  )
}

const mapStateToProps = state => ({
  items: getFilteredItems(state.items, state.activeTags)
})

export default connect(
  mapStateToProps
)(ItemList)

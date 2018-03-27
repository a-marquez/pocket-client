(function () {
  // dependencies
  const {compose, prop, propEq, equals, keys, values, isNil, when, bind, __} = R
  const {map, forEach, contains, filter, reject, anyPass, append, sort, sortBy, splitWhen, uniq, flatten, reverse} = R
  const {Dispatcher} = Flux
  const {Store, Container} = FluxUtils
  const {Component} = React

  // utilities
  function classBind(context, classFns) {return compose(bind(__, context), forEach((fn) => {context[fn.name] = fn.bind(context)}, classFns))}

  // configuration
  const config = {
    localStorageKey: 'pocketData',
    pocketDataRequest: ['https://localhost:8080/pocket-data?detailType=complete&state=all', {credentials: 'same-origin'}]
  }

  // app logic
  async function hydrateLocalStorageData(localStorageKey, dataRequest) {
    const localStorageData = localStorage.getItem(localStorageKey)
    if (localStorageData !== null) {
      return JSON.parse(localStorageData)
    } else {
      const response = await fetch(...dataRequest)
      const data = await response.json()
      localStorage.setItem(localStorageKey, JSON.stringify(data))
      return data
    }
  }

  const pareToTags = compose(
    sort(undefined),
    uniq,
    flatten,
    map(keys),
    reject(isNil),
    map(prop('tags'))
  )

  const transformRequestDataToPocketData = compose(
    sort(R.descend(R.prop('time_added'))),
    values,
    prop('list')
  )

  // components
  class PocketItem extends Component {
    render() {
      const {data} = this.props
      const date = new Date(data.time_added * 1000).toUTCString()
      data.tags = data.tags || {}
      return (<div className='item-container'>
        {data.resolved_title}
        <br/>
        {date}
        <br/>
        <a href={data.resolved_url} target='_blank'>{data.resolved_url}</a>
        <br/>
        <div className='tags-container'>
          {Object.values(data.tags).map((tag, index) => {return <button key={index} className='tag'>{tag.tag}</button>})}
        </div>
      </div>)
    }
  }

  class App extends Component {
    constructor(props) {
      super(props)
      this.state = {
        activeTags: []
      }
      classBind(this, [this.toggleTagFilter])
    }

    toggleTagFilter(event) {
      const tag = event.target.dataset.tag
      const activeTags = (contains(tag, this.state.activeTags) ? compose(reject, equals) : append)(tag)(this.state.activeTags)
      this.setState({activeTags})
    }

    async componentDidMount() {
      const localStorageData = await hydrateLocalStorageData(config.localStorageKey, config.pocketDataRequest)
      const pocketData = transformRequestDataToPocketData(localStorageData)
      const dataAge = Math.floor(new Date()/1000) - localStorageData.since
      const shouldUpdate = dataAge > 5
      if (shouldUpdate) {
        fetch(config.pocketDataRequest[0] + `&since=${localStorageData.since}`, config.pocketDataRequest[1])
          .then((response) => {return response.json()})
          .then(function(json) {
            let localStorageData = JSON.parse(localStorage.getItem(config.localStorageKey))
            if (keys(json.list).length > 0) {
              const [updateItems, deletionItems] = splitWhen(propEq('status', '2'), values(json.list))
              deletionItems.forEach((item) => {
                delete localStorageData.list[item.item_id]
              })
              updateItems.forEach((item) => {
                localStorageData.list[item.item_id] = item
              })
              let pocketData = transformRequestDataToPocketData(localStorageData)
              this.setState({pocketData, tags: pareToTags(pocketData)})
            }
            localStorageData.since = json.since
            localStorage.setItem(config.localStorageKey, JSON.stringify(localStorageData))
          }.bind(this))
          .catch((error) => {throw (error)})
      }
      this.setState({pocketData, tags: pareToTags(pocketData)})
    }

    render() {
      const isDataLoaded = this.state.pocketData !== undefined
      // TODO: improve filteredPocketData
      const filteredPocketData = when(() => {return this.state.activeTags.length > 0}, filter((item) => {return anyPass(map(contains, this.state.activeTags))(keys(item.tags))}))(this.state.pocketData)
      return (<div className='app-container'>
        <div>
        {isDataLoaded === true
          ? map((tag) => {return <button key={tag} data-tag={tag} onClick={this.toggleTagFilter} style={{color: contains(tag, this.state.activeTags) ? '#77ABB7' : '#000'}}>{tag}</button>}, this.state.tags)
          : 'Tags placeholder'
        }
        </div>
        {isDataLoaded === true
          ? map((item) => {return <PocketItem key={item.item_id} data={item} />}, filteredPocketData)
          : 'PocketItems placeholder'
        }
      </div>)
    }
  }

  ReactDOM.render( <App/>, document.getElementById('root'))
})()

(function () {
  // configuration
  const config = {
    localStorageKey: 'pocketData',
    pocketDataRequest: ['https://localhost:8080/pocket-data?count=20&detailType=complete', {credentials: 'same-origin'}]
  }

  // dispatcher
  const dispatcher = new Flux.Dispatcher()

  // actions
  const ActionTypes = {
  }
  const Actions = {
  }

  // functions
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

  // components
  class PocketItem extends React.Component {
    render() {
      const {data} = this.props
      data.tags = data.tags || {}
      return (<div className='item-container'>
        {data.resolved_title}
        <br/>
        <div className='tags-container'>
          {Object.values(data.tags).map((tag, index) => {return <span key={index} className='tag'>{tag.tag}</span>})}
        </div>
      </div>)
    }
  }

  class App extends React.Component {
    constructor(props) {
      super(props)
      this.state = {}
    }
    async componentDidMount() {
      const localStorageData = await hydrateLocalStorageData(config.localStorageKey, config.pocketDataRequest)
      const pocketData = Object.values(localStorageData.list)
      this.setState({pocketData})
    }
    render() {
      const isDataLoaded = this.state.pocketData !== undefined
      return (<div className='app-container'>
        {isDataLoaded === true
          ? this.state.pocketData.map((item) => {return <PocketItem key={item.item_id} data={item} />})
          : 'placeholder'
        }
      </div>)
    }
  }

  ReactDOM.render( <App/>, document.getElementById('root'))
})()

import React from 'react'
import {Component} from 'react'
import * as R from 'ramda'
import {compose, prop, propEq, equals, keys, values, descend, isNil, anyPass, when, bind, __, cond, T, identity, has} from 'ramda'
import {map, contains, filter, reject, append, sort, splitWhen, uniq, flatten} from 'ramda'

import PocketItem from './components/PocketItem.js'

import config from './config.js'
import {bindClassFns, log, debug} from './utilities.js'

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
  sort(descend(prop('time_added'))),
  values,
  prop('list')
)

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTags: [],
      untagged: false
    }
    bindClassFns(this, ['toggleTagFilter', 'toggleUntaggedFilter'])
  }

  toggleTagFilter(event) {
    const tag = event.target.dataset.tag
    const activeTags = (contains(tag, this.state.activeTags) ? compose(reject, equals) : append)(tag)(this.state.activeTags)
    this.setState({activeTags})
  }

  toggleUntaggedFilter() {
    const untagged = !this.state.untagged
    this.setState({untagged})
  }

  async componentDidMount() {
    const localStorageData = await hydrateLocalStorageData(config.localStorageKey, config.pocketDataRequest)
    const pocketData = transformRequestDataToPocketData(localStorageData)
    const dataAge = Math.floor(new Date()/1000) - localStorageData.since
    const shouldUpdate = dataAge > 5
    if (shouldUpdate === true) {
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
    const isUntaggedFilterEnabled = this.state.untagged === true
    const filteredPocketData = cond([
      [() => {return isUntaggedFilterEnabled}, reject(has('tags'))],
      [() => {return this.state.activeTags.length > 0}, filter((item) => {return anyPass(map(contains, this.state.activeTags))(keys(item.tags))})],
      [T, identity]
    ])(this.state.pocketData)
    const ifTagActive = contains(__, this.state.activeTags)
    return (<div className='absolute flex flex-column fill'>
      <div className='margin'>
        <div className='tags-container'>
        {isDataLoaded === true
          ? map((tag) => {return <button key={tag} data-tag={tag} onClick={this.toggleTagFilter} className={`btn btn-sm ${ifTagActive(tag) ? 'btn-primary' : ''}`} disabled={isUntaggedFilterEnabled}>{tag}</button>}, this.state.tags)
          : <div className='loading loading-lg'></div>
        }
        </div>
        <div>
          {isDataLoaded === true
            ? (<div className='margin__top float-right'>
              <button onClick={this.toggleUntaggedFilter} className={`btn btn-sm margin--small__right ${isUntaggedFilterEnabled ? 'btn-primary' : ''}`}>untagged</button>
              <button className='btn btn-sm btn-action'><i className='icon icon-arrow-up'></i></button>
            </div>)
            : ''
          }
        </div>
      </div>
      <div className='flex-grow-1 overflow-auto padding__horizontal margin__bottom'>
        <div className='absolute floating-border'></div>
        <div className='absolute floating-border' style={{bottom: '1rem'}}></div>
        {isDataLoaded === true
          ? map((item) => {return <PocketItem key={item.item_id} data={item} />}, filteredPocketData)
          : ''
        }
      </div>
    </div>)
  }
}

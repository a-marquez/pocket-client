import React, {Component} from 'react'
import {
  compose, prop, propEq, equals, keys, values, descend, isNil, anyPass, __, cond, T, identity, has,
  map, contains, filter, reject, append, sort, splitWhen, uniq, flatten
} from 'ramda'

import config from '../config'
import {bindClassFns, getUnixEpoch} from '../utilities'

import PocketItem from './pocket-item'

async function hydrateLocalStorageData(localStorageKey, dataRequest) {
  const localStorageData = localStorage.getItem(localStorageKey)
  if (localStorageData !== null) {
    return JSON.parse(localStorageData)
  }
  const response = await fetch(...dataRequest)
  const data = await response.json()
  localStorage.setItem(localStorageKey, JSON.stringify(data))
  return data
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
    bindClassFns(this, ['userRefreshData', 'toggleTagFilter', 'toggleUntaggedFilter'])
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

  async refreshData(since) {
    return new Promise((resolve, reject) => {
      fetch(config.pocketGetDataRequest[0] + `&since=${since}`, config.pocketGetDataRequest[1])
        .then(response => {
          return response.json()
        })
        .then(json => {
          const localStorageData = JSON.parse(localStorage.getItem(config.localStorageKey))
          let state
          if (keys(json.list).length > 0) {
            const [updateItems, deletionItems] = splitWhen(propEq('status', '2'), values(json.list))
            console.info('refreshData updateItems', updateItems)
            console.info('refreshData deletionItems', deletionItems)
            deletionItems.forEach(item => {
              delete localStorageData.list[item.item_id]
            })
            updateItems.forEach(item => {
              localStorageData.list[item.item_id] = item
            })
            const pocketData = transformRequestDataToPocketData(localStorageData)
            state = {pocketData, tags: pareToTags(pocketData)}
          }
          localStorageData.since = json.since
          localStorage.setItem(config.localStorageKey, JSON.stringify(localStorageData))
          console.info('refreshData state', state)
          resolve(state)
        })
        .catch(reject)
    })
  }

  async userRefreshData() {
    const since = JSON.parse(localStorage.getItem(config.localStorageKey)).since
    const newState = await this.refreshData(since)
    console.info('userRefreshData newState', newState)
    if (newState !== undefined) {
      this.setState(newState)
    }
  }

  async componentDidMount() {
    const localStorageData = await hydrateLocalStorageData(config.localStorageKey, config.pocketGetDataRequest)
    const pocketData = transformRequestDataToPocketData(localStorageData)
    const state = {pocketData, tags: pareToTags(pocketData)}
    const dataAge = getUnixEpoch() - localStorageData.since
    const shouldUpdate = dataAge > 5
    console.info('componentDidMount state', state)
    this.setState(state)
    if (shouldUpdate === true) {
      const newState = await this.refreshData(localStorageData.since)
      console.info('componentDidMount newState', newState)
      if (newState !== undefined) {
        this.setState(newState)
      }
    }
  }

  render() {
    const isDataLoaded = this.state.pocketData !== undefined
    const isUntaggedFilterEnabled = this.state.untagged === true
    const filteredPocketData = cond([
      [() => {
        return isUntaggedFilterEnabled
      }, reject(has('tags'))],
      [() => {
        return this.state.activeTags.length > 0
      }, filter(item => {
        return anyPass(map(contains, this.state.activeTags))(keys(item.tags))
      })],
      [T, identity]
    ])(this.state.pocketData)
    const ifTagActive = contains(__, this.state.activeTags)
    return (
      <div className='absolute flex flex-column fill'>
        <div className='margin'>
          <div className='tags-container'>
            {isDataLoaded ?
              map(tag => {
                return <button key={tag} className={`btn btn-sm ${ifTagActive(tag) ? 'btn-primary' : ''}`} data-tag={tag} disabled={isUntaggedFilterEnabled} onClick={this.toggleTagFilter} type='button'>{tag}</button>
              }, this.state.tags) :
              <div className='loading loading-lg'/>
            }
          </div>
          {isDataLoaded ?
            <div>
              <div className='margin__top absolute'>
                <button type='button' className='btn btn-sm btn-action'><i className='icon icon-arrow-up'/></button>
                <button type='button' onClick={this.toggleUntaggedFilter} className={`btn btn-sm margin--small__left ${isUntaggedFilterEnabled ? 'btn-primary' : ''}`}>untagged</button>
              </div>
              <div className='margin__top float-right'>
                <button type='button' className='btn btn-sm btn-action'><i className='icon icon-plus'/></button>
                <button type='button' onClick={this.userRefreshData} className='btn btn-sm btn-action margin--small__left'><i className='icon icon-refresh'/></button>
              </div>
            </div> :
            ''
          }
        </div>
        <div className='flex-grow-1 overflow-auto margin__horizontal margin__bottom fill__vertical'>
          <div className='item-container overflow-auto fill__vertical back-white'>
            {isDataLoaded === true ?
              map(item => {
                return <PocketItem key={item.item_id} data={item}/>
              }, filteredPocketData) :
              ''
            }
          </div>
        </div>
      </div>
    )
  }
}

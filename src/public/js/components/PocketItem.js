import React, {Component} from 'react'
import {compose, addIndex, map, values, isNil} from 'ramda'

import {domainRegex} from '../utilities.js'

const mapIndexed = addIndex(map)

export default class PocketItem extends Component {
  render() {
    const {data} = this.props
    const title = data.resolved_title || data.given_title
    const date = new Date(data.time_added * 1000).toUTCString().split(' ').slice(1, 4).join(' ')
    const domain = (data.resolved_url || data.given_url).match(domainRegex)[1]
    const tags = isNil(data.tags) ? '' : compose(mapIndexed((tag, index) => {return <span key={index} className='chip'>{tag.tag}</span>}), values)(data.tags)
    return (<div className='card no-border__top'>
      <div className='card-body'>
        <a href={data.resolved_url} target='_blank'>
          <div className='card-title text-black h6 pointer'>
            {title}
            <span className='float-right text-gray'>{date}</span>
          </div>
        </a>
        <div className='float-right relative' style={{right: '-.5em'}}>{tags}</div>
        <div className='card-subtitle text-gray'>{domain}</div>
      </div>
    </div>)
  }
}

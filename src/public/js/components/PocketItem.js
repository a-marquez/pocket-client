import React, {Component} from 'react'
import {compose, addIndex, map, values, isNil} from 'ramda'

import {bindClassFns, domainRegex} from '../utilities.js'

const mapIndexed = addIndex(map)

export default class PocketItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hover: false
    }
    bindClassFns(this, ['disableHover', 'enableHover'])
  }

  enableHover() {
    this.setState({hover: true})
  }

  disableHover() {
    this.setState({hover: false})
  }

  render() {
    const {data} = this.props
    const isHovered = this.state.hover === true
    const hasTags = isNil(data.tags) === false
    const title = data.resolved_title || data.given_title
    const date = new Date(data.time_added * 1000).toUTCString().split(' ').slice(1, 4).join(' ')
    const domain = (data.resolved_url || data.given_url).match(domainRegex)[1]
    const tags = hasTags ? compose(mapIndexed((tag, index) => {return <span key={index} className='chip'>{tag.tag}</span>}), values)(data.tags) : ''
    const actionButtons = (<div>
      <a href={data.resolved_url} target='_blank'><button className='btn btn-sm btn-action margin--small__right'><i className='icon icon-link' /></button></a>
      <button className='btn btn-sm btn-action margin--small__right'><i className='icon icon-edit' /></button>
      <button className='btn btn-sm btn-action margin--small__right'><i className='icon icon-delete' /></button>
      <button className='btn btn-sm btn-action'><i className='icon icon-more-vert' /></button>
    </div>)
    return (<div onMouseEnter={this.enableHover} onMouseLeave={this.disableHover} className={`card no-border__top`}>
      <div className='card-body'>
        <div className='card-title'>
          <a href={data.resolved_url} className='text-black h6' target='_blank'>{title}</a>
          {isHovered
            ? <div className='float-right'>{actionButtons}</div>
            : <div className='float-right pointer text-gray'>{domain} &bull; {date}</div>
          }
        </div>
        {hasTags
          ?  <div className='relative margin--small__top' style={{left: '-.25em'}}>{tags}</div>
          : ''
        }
      </div>
    </div>)
  }
}

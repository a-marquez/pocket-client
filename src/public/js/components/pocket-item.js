import React, {Component} from 'react'
import {compose, addIndex, map, values, isNil} from 'ramda'

import {bindClassFns, domainRegex, getUnixEpoch} from '../utilities'
import config from '../config'

const mapIndexed = addIndex(map)

export default class PocketItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hover: false
    }
    bindClassFns(this, ['disableHover', 'enableHover', 'delete'])
  }

  enableHover() {
    this.setState({hover: true})
  }

  disableHover() {
    this.setState({hover: false})
  }

  async delete() {
    const action = [
      {
        action: 'delete',
        item_id: this.props.data.item_id,
        time: getUnixEpoch()
      }
    ]
    const response = await fetch(
      config.pocketSendDataRequest[0] +
        `actions=${encodeURI(JSON.stringify(action))}`,
      config.pocketSendDataRequest[1]
    )
    const json = await response.json()
    if (json.status === 1) {
      location.replace(location)
    } else {
      console.error('Error attempting delete.')
    }
  }

  render() {
    const {data} = this.props
    const isHovered = this.state.hover === true
    const hasTags = isNil(data.tags) === false
    const title = data.resolved_title || data.given_title
    const date = new Date(data.time_added * 1000)
      .toUTCString()
      .split(' ')
      .slice(1, 4)
      .join(' ')
    const domain = (data.resolved_url || data.given_url).match(domainRegex)[1]
    const tags = hasTags ?
      compose(
        mapIndexed((tag, index) => {
          return (
            <span key={index} className='chip'>
              {tag.tag}
            </span>
          )
        }),
        values
      )(data.tags) :
      ''
    const actionButtons = (
      <div>
        <a href={data.resolved_url} target='_blank'>
          <button type='button' className='btn btn-sm btn-action margin--small__right'>
            <i className='icon icon-link'/>
          </button>
        </a>
        <button type='button' className='btn btn-sm btn-action margin--small__right'>
          <i className='icon icon-edit'/>
        </button>
        <button type='button' onClick={this.delete} className='btn btn-sm btn-action margin--small__right'>
          <i className='icon icon-delete'/>
        </button>
        <button type='button' className='btn btn-sm btn-action'>
          <i className='icon icon-more-vert'/>
        </button>
      </div>
    )
    return (
      <div
        onMouseEnter={this.enableHover}
        onMouseLeave={this.disableHover}
        className='card padding--small__right'
      >
        <div className='card-body'>
          <div className='card-title'>
            <a
              href={data.resolved_url}
              className='text-black h6'
              target='_blank'
            >
              {title}
            </a>
            {isHovered ? (
              <div className='float-right'>{actionButtons}</div>
            ) : (
              <div className='float-right pointer text-gray'>
                {domain} &bull; {date}
              </div>
            )}
          </div>
          {hasTags ? (
            <div
              className='relative margin--small__top'
              style={{left: '-.25em'}}
            >
              {tags}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }
}

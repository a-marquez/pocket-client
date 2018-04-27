import {camelizeKeys, decamelizeKeys} from 'humps'
import {normalize, denormalize, schema} from 'normalizr'

import retrieveItemsResponse from './fixtures/retrieve-items-response'

export function normalization() {
  console.clear()
  const tags = new schema.Entity(
    'tags',
    {},
    {
      idAttribute: 'tag',
      processStrategy: value => ({
        id: value.tag,
        name: value.tag
      })
    }
  )
  const items = new schema.Entity(
    'items',
    {tags: [tags]},
    {
      idAttribute: 'itemId'
    }
  )
  const retrieveItemsSchema = {
    list: [items]
  }
  const response = camelizeKeys(retrieveItemsResponse)
  const normalizedItem = normalize(response, retrieveItemsSchema)
  const denormalizedItem = decamelizeKeys(
    denormalize({ list: [ normalizedItem.entities.items ] }, retrieveItemsSchema, normalizedItem.entities)
  )
  ;[
    retrieveItemsResponse,
    normalizedItem,
  ].forEach(console.log)
  console.log('denormalized:', denormalizedItem)
}

export default function experiment() {}

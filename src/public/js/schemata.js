import {schema} from 'normalizr'

export const tags = new schema.Entity(
  'tags',
  {},
  {
    idAttribute: 'tag',
    processStrategy: _ => ({
      id: _.tag,
      name: _.tag
    })
  }
)

export const items = new schema.Entity(
  'items',
  {tags: [tags]},
  {
    idAttribute: 'itemId',
    processStrategy: _ => ({
      id: _.itemId,
      title: _.givenTitle,
      url: _.resolvedUrl,
      tags: _.tags
    })
  }
)

export const retrieveItemsSchema = {
  list: [items]
}

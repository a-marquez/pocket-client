import {
  toPairs, map, join,
  compose as c
} from 'ramda'

export const paramateriseObject = c(
  join('&'),
  map(join('=')),
  toPairs
)

export default {paramateriseObject}

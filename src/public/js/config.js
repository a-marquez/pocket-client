export default {
  localStorageKey: 'pocketData',
  pocketGetDataRequest: ['http://localhost:8080/pocket-get?detailType=complete&state=all', {credentials: 'same-origin'}],
  pocketSendDataRequest: ['http://localhost:8080/pocket-send?', {credentials: 'same-origin'}]
}

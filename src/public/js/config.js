export default {
  localStorageKey: 'pocketData',
  pocketGetDataRequest: ['https://localhost:8080/pocket-get?detailType=complete&state=all', {credentials: 'same-origin'}],
  pocketSendDataRequest: ['https://localhost:8080/pocket-send?', {credentials: 'same-origin'}]
}

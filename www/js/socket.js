var WebSocket = require('reconnectingwebsocket')
var querystring = require('querystring')

module.exports.tailf = function(cb) {
	var query = querystring.parse(location.search.slice(1))

	
  var ws = new WebSocket('ws://' + window.location.href.split('/')[2] + '/tailf', null, {debug: false})

	ws.onopen = function() {
		ws.send(JSON.stringify(query))
	}
	ws.onmessage = function(message) {
		cb(message.data)
	}
	window.onbeforeunload = function() {
		ws.onclose = function () {} // disable onclose handler first
		ws.close()
	}
}

module.exports.logfiles = function(cb) {
  var ws = new WebSocket('ws://' + window.location.href.split('/')[2] + '/logfiles', null, {debug: false, reconnectInterval: 60000})
  ws.onmessage = function(message) {
    cb(message.data)
  }
}

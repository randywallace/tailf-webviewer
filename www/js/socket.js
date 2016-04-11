'use strict'

var WebSocket = require('reconnectingwebsocket')
var querystring = require('querystring')

var query = querystring.parse(location.search.slice(1))

var host = query.host || window.location.href.split('/')[2]

module.exports.tailf = function(cb) {
	var ws = new WebSocket('ws://' + host + '/tailf', null, {debug: false})

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
	var ws = new WebSocket('ws://' + host + '/logfiles', null, {debug: false, reconnectInterval: 60000})
	ws.onmessage = function(message) {
		cb(message.data)
	}
}

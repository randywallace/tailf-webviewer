'use strict'

const RenderRows = require('./render-rows')
const createRow = RenderRows.createRow
const socket = require('./socket')
const on = require('dom-event')
const classList = require('class-list')
const loop = require('frame-loop')

const searchInput = document.getElementById('search')
const pauseButtonClassList = classList(document.getElementById('pause'))

const maxInMemory = 10000
var maxInDom = 500
const refreshInterval = 250
const table = document.getElementById('log-table')

const lines = []
const render = RenderRows(table)
var renderLines = []
var currentSearchString = ''

socket.tailf(function(line) {
	if (lines.length >= maxInMemory) {
		lines.shift()
	}
	lines.push(line)

	if (currentSearchString === '' || lineMatchesSearchString(line)) {
		renderLines.push(line)
		if (renderLines.length >= maxInDom) {
			renderLines.shift()
		}
	}
})

scrollToBottom()

function lineMatchesSearchString(line) {
	return line.toLowerCase().indexOf(currentSearchString.toLowerCase()) !== -1
}

function refreshRenderLines() {
	if (currentSearchString) {
		renderLines = lines.filter(lineMatchesSearchString).slice(-maxInDom)
	} else {
		renderLines = lines.slice(-maxInDom)
	}
}

const engine = loop({
	fps: 10,
	correction: 0
}, function() {
	const bottom = atBottom()

	render(renderLines)

	if (bottom) {
		scrollToBottom()
	}
})

engine.run()

engine.on('fps', fps => console.log('actual fps:', fps))

onChange('max-on-screen', function(newValue) {
	const intValue = parseInt(newValue)

	if (intValue > 0) {
		maxInDom = intValue
		refreshRenderLines()
	}
})

onChange('search', newValue => {
	currentSearchString = newValue
	console.log('currentSearchString is', currentSearchString)
	refreshRenderLines()
})

onClick('pause', function() {
	engine.toggle()
	pauseButtonClassList.toggle('active')
})

function onClick(id, cb) {
	const e = document.getElementById(id)
	on(e, 'click', cb)
}

function onChange(id, cb) {
	const e = document.getElementById(id)
	on(e, 'keyup', function(event) {
		cb(e.value)
	})
}

function scrollToBottom() {
	const bottom = document.body.scrollHeight - window.innerHeight
	window.scrollTo(0, bottom)
}

function atBottom() {
	const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop
	const bottom = document.body.scrollHeight - window.innerHeight
	return bottom - scrollPosition < 50
}

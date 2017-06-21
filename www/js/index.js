'use strict'

const RenderRows = require('./render-rows')
const createRow = RenderRows.createRow
const socket = require('./socket')
const on = require('dom-event')
const classList = require('class-list')
const loop = require('frame-loop')

const searchInput = document.getElementById('search')
const pauseButtonClassList = classList(document.getElementById('pause'))

var column_visibility = { timestamp: '' };
console.log(column_visibility);


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

	render(renderLines, column_visibility)

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

onClick('timestamp', function() {
  classList(document.getElementById('timestamp')).toggle('active')
  classList(document.getElementById('timestamp_column')).toggle('hidden')
  if ( column_visibility.timestamp == 'hidden' ) {
    column_visibility.timestamp = ''
  } else {
    column_visibility.timestamp = 'hidden'
  }
  refreshRenderLines()
})

onClick('facility', function() {
  classList(document.getElementById('facility')).toggle('active')
  classList(document.getElementById('facility_column')).toggle('hidden')
  if ( column_visibility.facility == 'hidden' ) {
    column_visibility.facility = ''
  } else {
    column_visibility.facility = 'hidden'
  }
  refreshRenderLines()
})

onClick('level', function() {
  classList(document.getElementById('level')).toggle('active')
  classList(document.getElementById('level_column')).toggle('hidden')
  if ( column_visibility.level == 'hidden' ) {
    column_visibility.level = ''
  } else {
    column_visibility.level = 'hidden'
  }
  refreshRenderLines()
})

onClick('process', function() {
  classList(document.getElementById('process')).toggle('active')
  classList(document.getElementById('process_column')).toggle('hidden')
  if ( column_visibility.process == 'hidden' ) {
    column_visibility.process = ''
  } else {
    column_visibility.process = 'hidden'
  }
  refreshRenderLines()
})

onClick('pid', function() {
  classList(document.getElementById('pid')).toggle('active')
  classList(document.getElementById('pid_column')).toggle('hidden')
  if ( column_visibility.pid == 'hidden' ) {
    column_visibility.pid = ''
  } else {
    column_visibility.pid = 'hidden'
  }
  refreshRenderLines()
})

onClick('ip', function() {
  classList(document.getElementById('ip')).toggle('active')
  classList(document.getElementById('ip_column')).toggle('hidden')
  if ( column_visibility.ip == 'hidden' ) {
    column_visibility.ip = ''
  } else {
    column_visibility.ip = 'hidden'
  }
  refreshRenderLines()
})

onClick('hostname', function() {
  classList(document.getElementById('hostname')).toggle('active')
  classList(document.getElementById('hostname_column')).toggle('hidden')
  if ( column_visibility.hostname == 'hidden' ) {
    column_visibility.hostname = ''
  } else {
    column_visibility.hostname = 'hidden'
  }
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

var RenderRows = require('./render-rows')
var socket = require('./socket')
var on = require('dom-event')

var searchInput = document.getElementById('search')

var is_paused = false

var maxInMemory = 10000
var maxInDom = 100

var refresh_interval = 50

var lines = []
var render = RenderRows(document.getElementById('log-table'))

var logfiles = []

var hostnames = []

var programs = []

Array.prototype.pushUnique = function (item){
    if(this.indexOf(item) == -1) {
    //if(jQuery.inArray(item, this) == -1) {
        this.push(item);
        return true;
    }
    return false;
}

toggle_pause = function() {
  elem = document.getElementById('pause')
  if ( elem.classList.contains('active') ) {
    elem.classList.remove('active')
    is_paused = false
  } else {
    elem.classList.add('active')
    is_paused = true
  }
}

socket.tailf(function(line) {
  // split_line = line.split('|').slice(0,7)
  // split_line.splice(2,1)
  // console.log(split_line);
	if (lines.length === maxInMemory) {
		var removed = lines.shift()
	}
	lines.push(line)
  var split_lines = line.split('|')
  hostnames.pushUnique(split_lines[3])
  if ( split_lines[4] != undefined && split_lines[4] != "" ) {
    programs.pushUnique(split_lines[4])
  }
  console.log(hostnames)
  console.log(programs)
})

//socket.logfiles(function(line) {
//  console.log('pushing' + line)
//  elem = document.getElementById('logfile_list')
//  child = document.createElement('option')
//  child.value = line
//  elem.appendChild(child)
//})

scrollToBottom()

setInterval(function() {
	var bottom = atBottom()
	var searchString = searchInput.value
	var renderLines
	if (searchString) {
		renderLines = lines.filter(function(line) {
			return line.toLowerCase().indexOf(searchString.toLowerCase()) !== -1
		}).slice(-maxInDom)
	} else {
		renderLines = lines.slice(-maxInDom)
	}
  if ( is_paused === false ) {
	  render(renderLines)
  }

	if (bottom) {
		scrollToBottom()
	}

}, refresh_interval)

function onChange(id, cb) {
	var e = document.getElementById(id)
	on(e, 'change', function(event) {
		cb(e.value)
	})
}

onChange('max-on-screen', function(newValue) {
	var intValue = parseInt(newValue)

	if (intValue > 0) {
		maxInDom = intValue
	}
})

function scrollToBottom() {
	var bottom = document.body.scrollHeight - window.innerHeight
	window.scrollTo(0, bottom)
}

function atBottom() {
	var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop
	var bottom = document.body.scrollHeight - window.innerHeight
	return bottom - scrollPosition < 50
}

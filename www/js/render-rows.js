var h = require('virtual-dom/h')
var diff = require('virtual-dom/diff')
var patch = require('virtual-dom/patch')
var createElement = require('virtual-dom/create-element')

var isWarning = /WARNING|NOTICE|ALERT|WARN/
var isDanger = /EMERG|ERR|SEVERE|ERROR|FATAL/
var isInfo = /INFO/

module.exports = function(table) {
	var currentTree = renderTree([])
	var rootNode = createElement(currentTree)

	table.appendChild(rootNode)

	return function render(lines) {
		var newTree = renderTree(lines)
		var patches = diff(currentTree, newTree)
		rootNode = patch(rootNode, patches)
		currentTree = newTree
	}
}

function getClass(line) {
	if (isWarning.test(line)) {
		return 'warning'
	} else if (isDanger.test(line)) {
		return 'danger'
	} else if (isInfo.test(line)) {
		return ''
	} else {
    return 'info'
  }
}

function renderLineTree(line) {
	return h('tr', {
		className: getClass(line)
	}, [
		h('td', [
			line
		])
	])
}

function renderTree(logLines) {
	return h('tbody', logLines.map(renderLineTree))
}

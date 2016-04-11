const yo = require('yo-yo')

const isWarning = /WARNING|NOTICE|ALERT|WARN/
const isDanger = /EMERG|ERR|SEVERE|ERROR|FATAL/
const isInfo = /INFO/

module.exports = function(table) {
	const rootNode = createTableBody([])

	table.appendChild(rootNode)

	function update(newTableBody) {
		yo.update(rootNode, newTableBody)
	}

	return function render(lines) {
		update(createTableBody(lines))
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

function createTableBody(logLines) {
	const rows = logLines.map(createRow)
	return yo`
		<tbody>
			${rows}
		</tbody>
	`
}

function createRow(line) {
	const rowClass = getClass(line)
	return yo`
		<tr class="${rowClass}">
			<td>
				${line}
			</td>
		</tr>
	`
}

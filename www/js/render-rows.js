const yo = require('yo-yo')
const S = require('string')

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
  line = S(line).parseCSV('|', '', '', '')[0];
	return yo`
		<tr class="${rowClass}">
			<td>
				${line[2]}
			</td>
			<td>
				${line[0]}
			</td>
			<td>
				${line[1]}
			</td>
			<td>
				${line[4]}
			</td>
			<td>
				${line[5]}
			</td>
			<td>
				${line[6]}
			</td>
			<td id="log-message">
				${line[7]}
			</td>
		</tr>
	`
}

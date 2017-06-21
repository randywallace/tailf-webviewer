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

	return function render(lines, opts) {
		update(createTableBody(lines, opts))
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

function createTableBody(logLines, opts) {
	const rows = logLines.map(createRow, opts)
	return yo`
		<tbody>
			${rows}
		</tbody>
	`
}

function createRow(line) {
	const rowClass = getClass(line)
  line = S(line).parseCSV('|', '', '', '')[0];
  if ( line.length >= 8 ) {
	  return yo`
	  	<tr class="${rowClass}">
	  		<td class="${this.timestamp}">
	  			${line[2]}
	  		</td>
	  		<td class="${this.facility}">
	  			${line[0]}
	  		</td>
	  		<td class="${this.level}">
	  			${line[1]}
	  		</td>
	  		<td class="${this.pid}">
	  			${line[5]}
	  		</td>
        <td class="${this.hostname}">
          ${line[3]}
        </td>
	  		<td class="${this.ip}">
	  			${line[6]}
	  		</td>
	  		<td class="${this.process}">
	  			${line[4]}
	  		</td>
	  		<td id="log-message">
	  			${line[7]}
	  		</td>
	  	</tr>
	  `
  } else {
    return yo``
  }
}

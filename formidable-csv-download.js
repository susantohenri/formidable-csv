function formidable_csv_download() {
    var cells = []
    for (var cell of document.querySelectorAll(`[${FORMIDABLE_CSV.ATTRIBUTE}]`))
        cells.push(cell.getAttribute(`${FORMIDABLE_CSV.ATTRIBUTE}`))

    var getCols = cells.map(cell => { return cell.charAt(0) })
    getCols.sort()
    getCols.reverse()

    var getRows = cells.map(cell => { return parseInt(cell.replace(cell.charAt(0), '')) })
    getRows.sort((a, b) => { return b - a })

    var last_col = getCols[0]
        , last_row = getRows[0]
        , tbody = ''
        , tr = ''

    last_col = last_col.toLowerCase().charCodeAt(0) - 97

    for (var row = 0; row <= last_row; row++) {
        tr = ''
        for (var col = 0; col <= last_col; col++) {
            var colChar = String.fromCharCode(97 + col).toUpperCase()
                , element = document.querySelector(`[${FORMIDABLE_CSV.ATTRIBUTE}="${colChar}${row + 1}"]`)
                , content = ''
            if (element) switch (element.tagName) {
                case 'DIV':
                case 'LABEL':
                    content = element.childNodes[0].nodeValue
                    break
                case 'SELECT':
                    content = element.value
                    break
                case 'INPUT':
                    switch (element.getAttribute('type')) {
                        case 'radio':
                            var checked = document.querySelector(`[${FORMIDABLE_CSV.ATTRIBUTE}="${colChar}${row + 1}"]:checked`)
                            content = checked ? checked.nextSibling.data.trim() : ''
                            break
                        default:
                            content = element.value
                            break
                    }
            }
            tr += `<td>${content}</td>`
        }
        tbody += `<tr>${tr}</tr>`
    }
    document.querySelector('#formidable-csv-download').innerHTML = tbody

    var rows = document.querySelectorAll('#formidable-csv-download tr')
        , csv = []
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll('td, th')
        for (var j = 0; j < cols.length; j++) {
            var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
            data = data.replace(/"/g, '""')
            row.push('"' + data + '"')
        }
        csv.push(row.join(FORMIDABLE_CSV.DELIMITER))
    }
    var csv_string = csv.join('\n')

    var link = document.createElement('a')
    link.style.display = 'none'
    link.setAttribute('target', '_blank')
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string))
    link.setAttribute('download', FORMIDABLE_CSV.FILE_NAME)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
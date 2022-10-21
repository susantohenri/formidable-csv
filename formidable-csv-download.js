function formidable_csv_download() {
    var cells = []
    for (var cell of document.querySelectorAll('[data-csv]'))
    cells.push(cell.getAttribute('data-csv'))
    cells.sort()
    cells.reverse()

    var last_cell = cells[0]
    , last_col = last_cell.charAt(0)
    , last_row = parseInt(last_cell.replace(last_col, '')) - 1
    , tbody = ''
    , tr = ''

    last_col = last_col.toLowerCase().charCodeAt(0) - 97

    for (var row = 0; row <= last_row; row++) {
        tr = ''
        for (var col = 0; col <= last_col; col++) {
            var colChar = String.fromCharCode(97+col).toUpperCase()
            , element = document.querySelector(`[data-csv="${colChar}${row + 1}"]`)
            , content = '&nbsp;'
            if (element) switch (element.tagName) {
                case 'LABEL':
                    content = element.childNodes[0].nodeValue
                    break
                case 'INPUT':
                    content = element.value
                    break
            }
            tr += `<td>${content}</td>`
        }
        tbody += `<tr>${tr}</tr>`
    }

    var table = `<table>${tbody}</table>`
    document.querySelector('#formidable-csv-download').innerHTML = table
}
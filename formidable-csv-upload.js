document.getElementById('formidable-csv-upload-button').addEventListener('change', e => {
    var file = e.target.files[0]
        , triggerChange = new Event('change')
    if (!file) return
    var reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function (e) {
        var csv_string = e.target.result
            , rows = csv_string.split('\n')
            , cols = []
            , rowNum = 0
            , colNum = 0
            , colChar = ''
            , element = null

        for (var row of rows) {
            rowNum++
            colNum = 0
            cols = row.split(`"${FORMIDABLE_CSV.DELIMITER}"`)
            for (var content of cols) {
                content = content.split(`"`).join(``)
                colNum++
                colChar = String.fromCharCode(97 + colNum - 1).toUpperCase()
                element = document.querySelector(`[${FORMIDABLE_CSV.ATTRIBUTE}="${colChar}${rowNum}"]`)

                if (element) {
                    switch (element.tagName) {
                        case 'SELECT':
                            for (var option of element.querySelectorAll('option')) {
                                // if (content === option.text) option.setAttribute('selected', true) // BY TEXT
                                if (content === option.value) option.setAttribute('selected', true) // BY VALUE
                            }
                            break
                        case 'INPUT':
                            switch (element.getAttribute('type')) {
                                case 'radio':
                                    for (var radio of document.querySelectorAll(`[${FORMIDABLE_CSV.ATTRIBUTE}="${colChar}${rowNum}"]`)) {
                                        if (content == radio.nextSibling.data.trim()) radio.click()
                                    }
                                    break
                                default:
                                    element.value = content
                                    break
                            }
                    }
                    element.dispatchEvent(triggerChange)
                }
            }
        }
    }
    document.getElementById('formidable-csv-upload-button').value = ''
}, false);
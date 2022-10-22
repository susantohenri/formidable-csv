document.getElementById('formidable-csv-upload-button').addEventListener('change', e => {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
        var csv_string = e.target.result
            , rows = csv_string.split('\n')
            , cols = []
            , rowNum = 0
            , colNum = 0
            , colChar= ''
            , element = null

        for (var row of rows) {
            rowNum++
            colNum = 0
            cols = row.split(FORMIDABLE_CSV.DELIMITER)
            for (var content of cols) {
                content = JSON.parse(content)
                colNum++
                colChar = String.fromCharCode(97 + colNum - 1).toUpperCase()
                element = document.querySelector(`[${FORMIDABLE_CSV.ATTRIBUTE}="${colChar}${rowNum}"]`)

                if (element) switch (element.tagName) {
                    case 'LABEL': break
                    case 'INPUT':
                        switch (element.getAttribute('type')) {
                            case 'radio':
                                for (var radio of document.querySelectorAll(`[${FORMIDABLE_CSV.ATTRIBUTE}="${colChar}${rowNum}"]`)) {
                                    if (`\n${content}` == radio.nextSibling.data) radio.checked = true
                                    else radio.checked = false
                                }
                                break
                            default:
                                element.value = content
                                break
                        }
                }
            }
        }
    }
    document.getElementById('formidable-csv-upload-button').value = ''
}, false);
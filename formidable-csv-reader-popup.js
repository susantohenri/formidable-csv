jQuery(() => {
	jQuery('body').append(`
		<div id='formidable-csv-reader-popup' class='modal fade' role='dialog'>
			<div class='modal-dialog'>

				<div class='modal-content'>
					<div class='modal-header'>
						<button type='button' class='close' data-dismiss='modal'>&times;</button>
						<h4 class='modal-title'>Modal Header</h4>
					</div>
					<div class='modal-body'>
						<table></table>
					</div>
					<div class='modal-footer'>
						<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>
					</div>
				</div>

			</div>
		</div>
	`)
    jQuery(`[${FORMIDABLE_CSV.READER_ATTRIBUTE}]`).click(function () {
        var url = jQuery(this).attr(FORMIDABLE_CSV.READER_ATTRIBUTE)
            , popup = jQuery(`[id='formidable-csv-reader-popup']`)

        jQuery.get(url, function (result) {
            var csv_string = result
                , rows = csv_string.split('\n')
                , cols = []
                , rowNum = 0
                , colNum = 0
                , colChar = ''
                , tbody = ''

            for (var row of rows) {
                rowNum++
                colNum = 0
                cols = row.split(`"${FORMIDABLE_CSV.DELIMITER}"`)
                tbody += `<tr>`
                for (var content of cols) {
                    content = content.split(`"`).join(``)
                    colNum++
                    colChar = String.fromCharCode(97 + colNum - 1).toUpperCase()
                    tbody += `<td>${content}</td>`
                }
                tbody += `</tr>`
            }

            popup.find('table').html(tbody)
        })
    })
})
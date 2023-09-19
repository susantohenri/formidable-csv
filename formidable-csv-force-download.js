jQuery(function () {
    jQuery('a[href$=".csv"]').click(function (event) {
		event.preventDefault()
        var href = jQuery(this).attr('href')
            , filename = href.split('/')[href.split('/').length - 1]
        jQuery.get(href, function (csv) {
            var link = document.createElement('a')
            link.style.display = 'none'
            link.setAttribute('target', '_blank')
            link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv))
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        })
    })
})
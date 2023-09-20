function generateRfpData() {
    var rfpData = {};
    jQuery('[data-rfp-field]').each(function (i, item) {
        var $this = jQuery(item);
        if (!$this.is(':visible')) {
            return;
        }
        if ($this.data('rfp-heading')) {
            rfpData[$this.data('rfp-field') + '-heading'] = $this.data('rfp-heading');
        }
        var field = $this.data('rfp-field-label');
        var label = $this.find('.frm_primary_label .control-label');
        if (!label.length) {
            label = $this.find('.frm_primary_label');
        }
        if (!field) {
            if (label && label[0]) {
                field = (label[0].childNodes[0] ? label[0].childNodes[0].nodeValue : label[0].nodeValue).trim();
            }
        }
        if ($this.data('rfp-tax-history') !== undefined) {
            field = 'Tax History';
            var taxTable = $this.find('table#form-table');
            var taxHistory = [];
            taxTable.find('tbody tr').each(function (index, row) {
                var $this = jQuery(row);
                var cols = $this.children('td');
                var tax = {
                    ' ': cols[1].textContent,
                    'Tax Years': cols[2].textContent,
                    'Federal Income Tax Form': cols[3].textContent,
                    'Legal Entity': cols[4].textContent,
                    'Subject to BBA': cols[5].textContent,
                };
                taxHistory.push(tax);
            });
            rfpData[$this.data('rfp-field')] = [field, taxHistory];
            return;
        }
        if (field === '') {
            return;
        }
        var fieldVal = '';
        var setFieldVal = function (index, input) {
            var $this = jQuery(input);
            var element = $this.prop('tagName').toString().toLowerCase();

            switch (element) {
                case 'input':
                    if ($this.attr('type') === 'radio') {
                        if ($this.prop('checked')) {
                            fieldVal = $this.val();
                        }
                    } else if ($this.attr('type') === 'checkbox') {
                        if ($this.prop('checked')) {
                            fieldVal += $this.val() + '\r\n\r\n';
                        }
                    } else {
                        fieldVal = $this.val();
                    }
                    break;
                case 'select':
                case 'textarea':
                    fieldVal = $this.val();
                    if (element === 'select' && $this.val() === 'Other') {
                        var otherField = $this.siblings('.frm_other_input');
                        if (otherField) {
                            var otherVal = otherField.val().trim();
                            if (otherVal === '') {
                                fieldVal = '';
                                return;
                            }
                            fieldVal = fieldVal + ' — ' + otherVal;
                        }
                    }
                    break;
            }
        };
        $this.find('input').each(setFieldVal);
        $this.find('textarea').each(setFieldVal);
        $this.find('select').each(setFieldVal);
        if (field && fieldVal) {
            if (typeof rfpData[$this.data('rfp-field')] === 'undefined') {
                rfpData[$this.data('rfp-field')] = [field, fieldVal.trim().split('\r\n\r\n')];
            } else {
                var existing = rfpData[$this.data('rfp-field')];
                if (typeof existing[1] === 'string') {
                    existing[1] = [existing[1]];
                }
                existing[1].push(fieldVal.trim());
                rfpData[$this.data('rfp-field')] = existing;
            }
        }
    });

    return rfpData;
}

function shouldIgnoreLabel(label) {
    var ignoreLabels = ['Additional Notes', 'Common Questions'];
    var total = ignoreLabels.length;
    for (var i = 0; i < total; i++) {
        if (ignoreLabels[i] === label) {
            return true;
        }
    }

    return false;
}

// function addFieldLabelAdditionalRow(label) {
//     var additionalRowLabels = ['Additional Notes'];
//     var total = additionalRowLabels.length;
//     for (var i = 0; i < total; i++) {
//         if (additionalRowLabels[i] === label) {
//             return true;
//         }
//     }

//     return false;
// }

function generateRfpCsvFile(data) {
    var titleDesc = ('"' + jQuery('[data-rfp-title]').text() + '"\r\n"' + 'Rbundle ' + jQuery('[data-rfp-description]').text() + '"').trim();
    var csv = [titleDesc];
    Object.entries(data).forEach(function (field) {
        // console.log(field);
        if (field[0].indexOf('heading') !== -1) {
            return;
        }
        if (typeof data[field[0] + '-heading'] !== 'undefined') {
            csv.push(data[field[0] + '-heading']);
        }
        var row = [];
        field = field[1];
        if (typeof field[1] === 'object') {
            if (field[0] === 'Tax History') {
                var addedHeaders = false;
                field[1].forEach(function (taxHistory) {
                    if (!addedHeaders) {
                        var headers = [];
                        Object.keys(taxHistory).forEach(function (key) {
                            headers.push('"' + key.replace(/"/g, '""') + '"');
                        });
                        addedHeaders = true;
                        row.push(headers.join(FORMIDABLE_CSV.DELIMITER));
                    }
                    var values = [];
                    Object.values(taxHistory).forEach(function (value) {
                        values.push('"' + value.replace(/"/g, '""') + '"');
                    });
                    row.push(values.join(FORMIDABLE_CSV.DELIMITER));
                });
            } else {
                if (shouldIgnoreLabel(field[0])) {
                    // Skipping for now
                    // row.push('""');
                } else {
                    row.push('"' + field[0].replace(/"/g, '""') + '"');
                }
                field[1] = field[1].map(function (value) {
                    return '"' + value.replace(/"/g, '""') + '"';
                });
                row.push(field[1].join('\r\n'));
            }
        } else {
            if (shouldIgnoreLabel(field[0])) {
                // Skipping for now
                // row.push('""');
            } else {
                row.push('"' + field[0].replace(/"/g, '""') + '"');
            }
            row.push('"' + field[1].replace(/"/g, '""') + '"');
        }
        csv.push(row.join('\r\n'));
    });

    var csv_string = csv.join('\r\n\r\n');

    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', FORMIDABLE_CSV.FILE_NAME);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function formidable_csv_download() {
    var data = generateRfpData();
    if (data) {
        generateRfpCsvFile(data);
    }
}

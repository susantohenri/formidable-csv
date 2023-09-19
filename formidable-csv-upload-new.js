document.getElementById('formidable-csv-upload-button').addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) {
        return false;
    }
    jQuery(e.target).parents('.rfp-view').find('form').trigger('reset');
    var reader = new FileReader();
    reader.onload = readRfpDataFile;
    reader.readAsText(file);
});

var incrementalIndex = {
    'Common Questions': 1,
    'Question For Providers': 1,
};

var incrementalNextIndex = {
    'Additional Notes': 2,
    'Question For Providers': 2,
};

function readRfpDataFile(e) {
    var reader = e.target;
    var rows = reader.result.split(/\r\n|\r|\n/g);
    var parse = function (row) {
        var insideQuote = false, entries = [], entry = [];
        if (typeof row === 'undefined') {
            return '';
        }
        row.split('').forEach(function (character) {
            if (character === '"') {
                insideQuote = !insideQuote;
            } else {
                if (character === FORMIDABLE_CSV.DELIMITER && !insideQuote) {
                    entries.push(entry.join(''));
                    entry = [];
                } else {
                    entry.push(character);
                }
            }
        });
        entries.push(entry.join(''));
        entries = entries.filter(function (entry) {
            return entry !== '';
        });
        return entries.length > 1 ? entries : entries[0];
    };
    var totalRows = rows.length;
    var taxData = rows.filter(function (row) {
        var column = parse(row);
        return typeof column === 'object';
    });
    var index;
    for (index = 0; index < totalRows; index++) {
        var row = rows[index];

        var column = parse(row);
        if (typeof incrementalIndex[column] === 'number') {
            index+= incrementalIndex[column];
            break;
        }
        var nextIndex = index + 1;
        if (typeof incrementalNextIndex[column] === 'number') {
            nextIndex = index + incrementalNextIndex[column];
        }
        var nextColumn = parse(rows[nextIndex]);
        if (nextColumn === '' || nextColumn === undefined) {
            continue; // Treat as heading/answer of a question already processed
        }
        if (typeof column === 'string') {
            column = column.replace(/"([^"]+(?="))"/g, '$1');
            var value = nextColumn.replace(/"([^"]+(?="))"/g, '$1');
            if (jQuery('[data-rfp-heading="' + value + '"]').length) {
                continue; // Matched the section heading
            }
            if (typeof nextColumn !== 'string') {
                continue; // Don't process tax data array
            }
            var field = jQuery('[data-rfp-field]:contains("' + column + '")');
            if (!field.length) {
                continue; // Didn't find the field
            }
            var valueSet = false;
            var setFieldVal = function (index, domElement) {
                if (valueSet) {
                    return;
                }
                var $this = jQuery(domElement);
                var element = $this.prop('tagName').toString().toLowerCase();
                // console.log(`Element: ${element}, Value: ${nextColumn}`);

                switch (element) {
                    case 'input':
                        // console.log(`Checking ${$this.val()} === ${value}`);
                        if ($this.attr('type') === 'radio' || $this.attr('type') === 'checkbox') {
                            if ($this.val() === value) {
                                $this.prop('checked', true).trigger({ type: 'change', originalEvent: 'custom' });
                                valueSet = true;
                            }
                        } else {
                            $this.val(value).trigger({ type: 'change', originalEvent: 'custom' });
                            valueSet = true;
                        }
                        break;
                    case 'select':
                        if (value.indexOf('Other') === 0) {
                            var otherField = $this.siblings('.frm_other_input');
                            if (otherField) {
                                var otherVal = value.split('—');
                                if (otherVal.length === 2) {
                                    otherField.val(otherVal[1].trim()).trigger({ type: 'change', originalEvent: 'custom' });
                                }
                            }
                            value = 'Other';
                        }
                        $this.find('option[value="' + value + '"]').prop('selected', true);
                        $this.trigger({ type: 'change', originalEvent: 'custom' });
                        valueSet = true;
                        break;
                    case 'textarea':
                        $this.val(value).trigger({ type: 'change', originalEvent: 'custom' });
                        valueSet = true;
                        break;
                }
            };
            field.find('input, select, textarea').each(setFieldVal);
        }
    }
    var additionalQuestionsSection = jQuery('.additional-questions');
    var triggerQuestionSections = additionalQuestionsSection.find('.frm_trigger');
    if (additionalQuestionsSection.find('[data-rfp-field]').is(':visible')) {
        triggerQuestionSections.click(); // Show the additional questions section
    }
    var commonQuestionField = jQuery('[data-rfp-field]:contains("Common Questions")');
    var customQuestionField = commonQuestionField.parents('.frm_form_field').siblings('.add-custom-questions');
    var addMoreQuestionBtn = customQuestionField.find('.frm_add_form_row').first();
    for (; index < totalRows; index++) {
        var row = rows[index];
        var column = parse(row);
        if (!column || typeof column !== 'string') {
            continue;
        }
        column = column.replace(/"([^"]+(?="))"/g, '$1');
        var checkbox = commonQuestionField.find('.frm_checkbox:contains("' + column + '")');
        if (checkbox.length) {
            checkbox.find('input').prop('checked', true);
            continue;
        } else {
            break;
        }
    }
    jQuery('.frm_remove_form_row', customQuestionField).click();
    function addCustomQuestion(index) {
        function eventHandler() {
            setTimeout(function () {
                var row = rows[index];
                if (typeof row === 'undefined') {
                    console.log('returning, row is undefined', row);
                    return;
                }
                var column = parse(row);
                if (!column || typeof column !== 'string') {
                    console.log('returning', column);
                    return;
                }
                var value = column.replace(/"([^"]+(?="))"/g, '$1');
                var customField = customQuestionField.children('.frm_repeat_inline').last();
                if (customField) {
                    customField.find('input').val(value);
                }
                if (index <= rows.length - 1) {
                    addMoreQuestionBtn.click();
                    index++;
                } else {
                    jQuery(document).off('frmAfterAddRow', eventHandler);
                }
            }, 150);
        }
        jQuery(document).on('frmAfterAddRow', eventHandler);
        addMoreQuestionBtn.click();
    }
    addCustomQuestion(index);

    if (taxData.length) {
        jQuery('#body-table table#form-table tbody').empty();
        taxData.forEach(function (tax) {
            var data = tax.split(FORMIDABLE_CSV.DELIMITER);
            if (data[0] === '" "' && data[1] === '"Tax Years"') {
                return; // Header
            }
            addTableRow();
            var newRow = jQuery('#body-table table#form-table tbody tr').last();
            var cols = newRow.children('td');
            data.forEach(function (value, index) {
                jQuery(cols[index + 1]).text(value.replace(/"([^"]+(?="))"/g, '$1'));
            });
        });
    }
}

<?php

/**
 * Formidable CSV
 *
 * @package     FormidableCSV
 * @author      Henri Susanto
 * @copyright   2022 Henri Susanto
 * @license     GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name: Formidable CSV
 * Plugin URI:  https://github.com/susantohenri
 * Description: Formidable form add-on for convert form to CSV vice-versa
 * Version:     1.0.0
 * Author:      Henri Susanto
 * Author URI:  https://github.com/susantohenri
 * Text Domain: Formidable-CSV
 * License:     GPL v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

define('FORMIDABLE_CSV_DELIMITER', ',');
define('FORMIDABLE_CSV_ATTRIBUTE', 'data-csv');
define('FORMIDABLE_CSV_READER_ATTRIBUTE', 'data-csv-url');

add_shortcode('formidable-csv-upload-button', function () {
    wp_register_script('formidable-csv-upload', plugin_dir_url(__FILE__) . 'formidable-csv-upload.js');
    wp_enqueue_script('formidable-csv-upload');
    wp_localize_script(
        'formidable-csv-upload',
        'FORMIDABLE_CSV',
        array(
            'DELIMITER' => FORMIDABLE_CSV_DELIMITER, 'ATTRIBUTE' => FORMIDABLE_CSV_ATTRIBUTE
        )
    );
    return '<input type="file" id="formidable-csv-upload-button">';
});

add_shortcode('formidable-csv-download-button', function ($atts) {
    $atts = shortcode_atts(['file-name' => 'Formidable CSV Default File Name.csv'], $atts);
    $atts['file-name'] .= '.csv' !== substr($atts['file-name'], -4) ? '.csv' : '';

    wp_register_script('formidable-csv-download', plugin_dir_url(__FILE__) . 'formidable-csv-download.js');
    wp_enqueue_script('formidable-csv-download');
    wp_localize_script(
        'formidable-csv-download',
        'FORMIDABLE_CSV',
        array(
            'DELIMITER' => FORMIDABLE_CSV_DELIMITER, 'ATTRIBUTE' => FORMIDABLE_CSV_ATTRIBUTE, 'FILE_NAME' => $atts['file-name']
        )
    );
    return
        '<table id="formidable-csv-download" style="display:none"></table>'
        . '<button onclick="formidable_csv_download(); return false;"> Download CSV </button>';
});

add_shortcode('formidable-csv-reader-popup', function () {
    $FORMIDABLE_CSV_READER_ATTRIBUTE = FORMIDABLE_CSV_READER_ATTRIBUTE;

    wp_register_style('jquerymodal', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css');
    wp_enqueue_style('jquerymodal');

    wp_register_script('jquerymodal', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js');
    wp_enqueue_script('jquerymodal');

    wp_register_style('formidable-csv-reader-popup', plugin_dir_url(__FILE__) . 'formidable-csv-reader-popup.css?cache-breaker=' . time());
    wp_enqueue_style('formidable-csv-reader-popup');

    wp_register_script('formidable-csv-reader-popup', plugin_dir_url(__FILE__) . 'formidable-csv-reader-popup.js?cache-breaker=' . time());
    wp_enqueue_script('formidable-csv-reader-popup');
    wp_localize_script(
        'formidable-csv-reader-popup',
        'FORMIDABLE_CSV',
        array(
            'DELIMITER' => FORMIDABLE_CSV_DELIMITER, 'READER_ATTRIBUTE' => FORMIDABLE_CSV_READER_ATTRIBUTE
        )
    );

    return "
    <div id='formidable-csv-reader-popup'>
        <table></table>
    </div>";
});

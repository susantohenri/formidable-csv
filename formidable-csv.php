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

function formidable_csv_register_scripts() {
    wp_register_script('formidable-csv-upload', plugin_dir_url(__FILE__) . 'formidable-csv-upload.js', []);
    wp_register_script('formidable-csv-download', plugin_dir_url(__FILE__) . 'formidable-csv-download.js', []);
}
add_action('wp_enqueue_scripts', 'formidable_csv_register_scripts');

add_shortcode('formidable-csv-upload-button', function () {
    wp_enqueue_script('formidable-csv-upload');
    wp_localize_script(
        'formidable-csv-upload',
        'FORMIDABLE_CSV',
        array(
            'DELIMITER' => FORMIDABLE_CSV_DELIMITER, 'ATTRIBUTE' => FORMIDABLE_CSV_ATTRIBUTE
        )
    );
    return '<input type="file" accept=".csv" id="formidable-csv-upload-button">';
});

add_shortcode('formidable-csv-download-button', function ($atts) {
    $atts = shortcode_atts(['file-name' => 'Formidable CSV Default File Name.csv', 'new-js' => 'no'], $atts);
    $atts['file-name'] .= '.csv' !== substr($atts['file-name'], -4) ? '.csv' : '';

    // $file = $atts['new-js'] === 'yes' ? 'formidable-csv-download-new.js' : 'formidable-csv-download.js';

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
        . '<button class="btn btn-default" onclick="formidable_csv_download(); return false;">Save Progress</button>';
});

add_shortcode('formidable-csv-reader-popup', function ($atts) {
    $FORMIDABLE_CSV_READER_ATTRIBUTE = FORMIDABLE_CSV_READER_ATTRIBUTE;
    $atts = shortcode_atts(['modal-header' => ''], $atts);

    wp_register_style('formidable-csv-reader-popup', plugin_dir_url(__FILE__) . 'formidable-csv-reader-popup.css?cache-breaker=' . time());
    wp_enqueue_style('formidable-csv-reader-popup');

	wp_register_script('bootstrap', 'https://cdn.usebootstrap.com/bootstrap/3.3.7/js/bootstrap.min.js');
    wp_enqueue_script('bootstrap');

	wp_register_script('formidable-csv-reader-popup', plugin_dir_url(__FILE__) . 'formidable-csv-reader-popup.js?cache-breaker=' . time());
    wp_enqueue_script('formidable-csv-reader-popup');
    wp_localize_script(
        'formidable-csv-reader-popup',
        'FORMIDABLE_CSV',
        array(
            'DELIMITER' => FORMIDABLE_CSV_DELIMITER, 'READER_ATTRIBUTE' => FORMIDABLE_CSV_READER_ATTRIBUTE, 'MODAL_HEADER' => $atts['modal-header']
        )
    );

    return "";
});

add_shortcode('formidable-csv-force-download', function () {
    wp_register_script('formidable-csv-force-download', plugin_dir_url(__FILE__) . 'formidable-csv-force-download.js?cache-breaker=' . time());
    wp_enqueue_script('formidable-csv-force-download');
});

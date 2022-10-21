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

add_shortcode('formidable-csv-upload-button', function () {
    wp_register_script('formidable-csv-upload', plugin_dir_url(__FILE__) . 'formidable-csv-upload.js');
    wp_enqueue_script('formidable-csv-upload');
    return '<input type="file" name="formidable-csv-upload-button">';
});

add_shortcode('formidable-csv-download-button', function () {
    wp_register_script('formidable-csv-download', plugin_dir_url(__FILE__) . 'formidable-csv-download.js');
    wp_enqueue_script('formidable-csv-download');
    return
        '<div id="formidable-csv-download" style="display:none"></div>'
        . '<button onclick="formidable_csv_download(); return false;"> Download CSV </button>';
});

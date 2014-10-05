var CHROME_SYNC_KEY = "YACEP_CHROME_SYNC_DATA";
var stored_data = {};

$(function() {
    var app_detail = chrome.app.getDetails();
    var version = app_detail.version;
    $('#yacep_version').html(version);
    $('#option_page').click(function () {
        chrome.tabs.create({url:chrome.extension.getURL(app_detail.options_page)});
    });

    $('#homepage').click(function(){
        chrome.tabs.create({url: $(this).attr('href')});
    });

    $('#btn-status').click(function() {
        switchStatus();
    });

    chrome.storage.sync.get(CHROME_SYNC_KEY, function(data) {
        stored_data = data;
        data = data[CHROME_SYNC_KEY];
        if (!$.isEmptyObject(data)) {
            var text = data.data_name + "_" + data.data_version;
            $('#current-data-info').html(text);
            $('#date-sync-info').html(data.date_sync);
            loadStatus(data.ext_status);
        }
    });
});

function loadStatus(status) {
    if (status != undefined && status == false) {
        $('#status').removeClass().addClass('text-danger').html('DISABLED');
        $('#btn-status').html('Enable');
    } else {
        $('#status').removeClass().addClass('text-primary').html('ENABLED');
        $('#btn-status').html('Disable');
    }
}

function switchStatus() {
    var status = true;
    if ($('#status').html() == 'ENABLED') {
        status = false;
    }
    stored_data[CHROME_SYNC_KEY]['ext_status'] = status;
    chrome.storage.sync.set(stored_data, function() {
        loadStatus(status);
    });
}
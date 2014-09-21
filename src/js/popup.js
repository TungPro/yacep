var CHROME_SYNC_KEY = "YACEP_CHROME_SYNC_DATA";

$(function() {
    var app_detail = chrome.app.getDetails();
    var version = app_detail.version;
    $('#yacep_version').html(version);
    $('#option_page').click(function () {
        chrome.tabs.create({url:chrome.extension.getURL(app_detail.options_page)});
    });

    chrome.storage.sync.get(CHROME_SYNC_KEY, function(data) {
        data = data[CHROME_SYNC_KEY];
        if (!$.isEmptyObject(data)) {
            var text = data.data_name + "_" + data.data_version;
            $('#current-data-info').html(text);
            $('#date-sync-info').html(data.date_sync);
        }
    });
});
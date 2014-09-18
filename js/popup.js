$(function() {
    var app_detail = chrome.app.getDetails();
    var version = app_detail.version;
    $('#yacep_version').html(version);
    $('#option_page').click(function () {
        chrome.tabs.create({url:chrome.extension.getURL(app_detail.options_page)});
    });
});
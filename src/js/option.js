var LOCAL_STORAGE_INFO_KEY = "YACEP_EMO_INFO";
var LOCAL_STORAGE_DATA_KEY = "YACEP_EMO_DATA";
var CHROME_SYNC_KEY = "YACEP_CHROME_SYNC_DATA";

var DEFAULT_DATA_URL = "http://yacep.thangtd.com/data/default.json";
var DEFAULT_IMG_HOST = "http://yacep.thangtd.com/";

var DEFAULT_VERSION = 1;
var BOX_ANH_EM_VERSION = 2;

$(function() {
    if (verifyInfoLocalStorage() && verifyDataLocalStorage()) {
        fillTable();
    } else {
        chrome.storage.sync.get(CHROME_SYNC_KEY, function(info) {
            var url = "";
            if (!$.isEmptyObject(info)) {
                info = JSON.stringify(info[CHROME_SYNC_KEY]);
                url = info.data_url;
            }
            if (!url) {
                url = DEFAULT_DATA_URL;
            }
            getData(url, fillTable);
        });
    }
    var app_detail = chrome.app.getDetails();
    var version = app_detail.version;
    $('#yacep_version').html(version);
    $('#btn-load').click(function () {
        getData(DEFAULT_DATA_URL, fillTable);
    });
});

function verifyInfoLocalStorage() {
    return localStorage[LOCAL_STORAGE_INFO_KEY] != 'undefined' && !$.isEmptyObject(localStorage[LOCAL_STORAGE_INFO_KEY]);
}

function verifyDataLocalStorage() {
    return localStorage[LOCAL_STORAGE_DATA_KEY] != 'undefined' && !$.isEmptyObject(localStorage[LOCAL_STORAGE_DATA_KEY]);
}

function getData(url, callback) {
    $.getJSON(url)
        .done(function(data) {
            if (typeof(data.data_version) !== 'undefined' && typeof(data.emoticons) !== 'undefined') {
                data.data_url = url;
                var emo = new EmoStorage(data);
                emo.syncData(callback);
                localStorage[LOCAL_STORAGE_DATA_KEY] = JSON.stringify(data.emoticons);
            }
        }).fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });
}

function clearTable() {
    $('#table-emo > tbody').html("");
}

function fillTable() {
    clearTable();
    var info = JSON.parse(localStorage[LOCAL_STORAGE_INFO_KEY]);
    $('#data-version').html(" (Version: " + info.data_name + "_" + info.data_version + " " + info.date_sync+ ")");
    var emoticons = JSON.parse(localStorage[LOCAL_STORAGE_DATA_KEY]);
    $.each(emoticons, function(key, emo) {
        row = createTableRow(emo);
        $('#table-emo > tbody').append(row);
    });
}

function createTableRow(data) {
    var src = getEmoUrl(data.src);
    var row = "<tr>";
    row += "<td>" + data.key + "</td>";
    row += "<td><img src='" + src + "'/> </td>";
    row += "<td><button class='btn btn-warning btn-sm action' id='btn-" + data.key + "'> Hide </button></td>";
    row += "</tr>";
    return row;
}

function getEmoUrl(img) {
    if (img.indexOf('https://') == 0 || img.indexOf('http://') == 0) {
        return img;
    }
    return DEFAULT_IMG_HOST + "img/emoticons/" + img;
}

function EmoStorage(inputed_data, data_custom) {
    this.data = {
        data_name: inputed_data.data_name,
        data_url: inputed_data.data_url,
        data_version: inputed_data.data_version,
        data_custom: data_custom,
        date_sync: (new Date()).toLocaleString()
    };
}

EmoStorage.prototype.getDataCustom = function() {
    return this.data.data_custom;
};

EmoStorage.prototype.syncData = function(callback) {
    localStorage[LOCAL_STORAGE_INFO_KEY] = JSON.stringify(this.data);
    var sync = {};
    sync[CHROME_SYNC_KEY] = this.data;
    chrome.storage.sync.set(sync, function() {
        if (typeof callback != 'undefined') {
            callback();
        }
    });
};


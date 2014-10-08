var LOCAL_STORAGE_INFO_KEY = "YACEP_EMO_INFO";
var LOCAL_STORAGE_DATA_KEY = "YACEP_EMO_DATA";
var CHROME_SYNC_KEY = "YACEP_CHROME_SYNC_DATA";

var DEFAULT_DATA_URL = "https://dl.dropboxusercontent.com/s/ik69cu3wnya6i0d/default.json?dl=1";
var DEFAULT_IMG_HOST = "http://yacep.thangtd.com/";

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
    $('#btn-reset').click(function() {
        getData(DEFAULT_DATA_URL, fillTable);
    });
    $('#btn-load').click(function() {
        if ($('#data-select').val() == 'default') {
            getData(DEFAULT_DATA_URL, fillTable);
        } else {
            var url = $('#data-url').val();
            if (!validateUrl(url)) {
                bootbox.alert("Invalid URL! Make sure your inputted URL is correct, and start with https!");
            } else {
                bootbox.dialog({
                    message: 'The data from <a href="' + url + '">' + url + '</a> may contain undesirable emoticons and we will not be responsible for it' ,
                    title: "<span class='text-danger'>Your are trying to load data that is not officially supported by YACEP.<br/> Do you want to continue ?</span>",
                    buttons: {
                        success: {
                            label: "OK!",
                            className: "btn-success",
                            callback: function() {
                                getData(url, fillTable);
                            }
                        },
                        danger: {
                            label: "Cancel!",
                            className: "btn-danger",
                            callback: function() {

                            }
                        }
                    }
                });
            }
        }
    });

    $('#data-select').change(function (){
        var val = $(this).val();
        if (val == 'default') {
            $('#url-input-div').hide("slow");
        } else {
            $('#url-input-div').show("slow");
        }
    });
});

function validateUrl(url) {
    var regexp = /(https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(url);
}

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
            } else {
                bootbox.alert("Invalid data structure!");
            }
        }).fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            bootbox.alert("Request Failed: " + err);
        });
}

function clearTable() {
    $('#table-emo > tbody').html("");
}

function fillTable() {
    clearTable();
    var info = JSON.parse(localStorage[LOCAL_STORAGE_INFO_KEY]);
    $('#data-version').html(" (Version: " + info.data_name + "_" + info.data_version + " " + info.date_sync+ ")");
    if (info.data_name != "Default" && info.data_url) {
        $('#data-select').val('custom');
        $('#data-url').val(info.data_url);
        $('#url-input-div').show("slow");
    }
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


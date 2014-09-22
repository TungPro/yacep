// Const
var LOCAL_STORAGE_DATA_KEY = "YACEP_EMO_DATA";
var LOCAL_STORAGE_INFO_KEY = "YACEP_EMO_INFO";

var CHROME_SYNC_KEY = "YACEP_CHROME_SYNC_DATA";

var DEFAULT_DATA_URL = "https://dl.dropboxusercontent.com/s/ik69cu3wnya6i0d/default.json?dl=1";


chrome.storage.sync.get(CHROME_SYNC_KEY, function(info) {
    info = info[CHROME_SYNC_KEY];
    var url = "";
    if (!$.isEmptyObject(info)) {
        console.log("Getting Data Info from Chrome Storage");
        url = info.data_url;
    }
    if (url == "") {
        console.log("No information from Chrome Storage. Using default Version");
        url = DEFAULT_DATA_URL;
    }
    getData(url, info);
});

function getData(url, info) {
    $.getJSON(url)
        .done(function(data) {
            if (typeof(data.data_version) !== 'undefined' && typeof(data.emoticons) !== 'undefined') {
                data.data_url = url;
                console.log("You are using Yacep!" + ". Data Name: " + data.data_name + ". Data Version: "
                + data.data_version);
                localStorage[LOCAL_STORAGE_DATA_KEY] = JSON.stringify(data.emoticons);
                info.data_name = data.data_name;
                info.data_version = data.data_version;
                info.date_sync = (new Date).toLocaleString();
                var sync = {};
                sync[CHROME_SYNC_KEY] = info;
                chrome.storage.sync.set(sync, function() {
                });
                addInjectedScript();
            }
        }).fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });
}

function addInjectedScript() {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL('js/emo.js');
    script.onload = function() {
        this.parentNode.removeChild(this);
    };
    (document.documentElement).appendChild(script);
}
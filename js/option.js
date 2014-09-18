var default_data_url = "http://cwep.thangtd.com/data/default.json";
// var default_data_url = "data/default.json";
var default_img_host = "http://cwep.thangtd.com/";

$(function() {
    var app_detail = chrome.app.getDetails();
    var version = app_detail.version;
    $('#yacep_version').html(version);
    $('#btn-load').click(function () {
        $.getJSON(default_data_url)
            .done(function(data) {
                if (typeof(data.data_version) !== 'undefined' && typeof(data.emoticons) !== 'undefined') {
                    $('#data-version').html(" (Version: " + data.data_version + ")");
                    var emoticons = data.emoticons;
                    $.each(emoticons, function(key, emo) {
                        row = createTableRow(emo);
                        $('#table-emo > tbody').append(row);
                    });
                }
            }).fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                console.log( "Request Failed: " + err );
            });
    });
});

function createTableRow(data) {
    var row = "<tr>";
    row += "<td>" + data.key + "</td>";
    row += "<td><img src='" + getEmoUrl(data.src) + "'/> </td>";
    row += "<td><button class='btn btn-warning btn-sm action' id='btn-" + data.key + "'> Hide </button></td>";
    row += "</tr>";
    return row;
}

function getEmoUrl(emo) {
    return default_img_host + "img/emoticons/" + emo;
}
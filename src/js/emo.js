// Const
var LOCAL_STORAGE_DATA_KEY = "YACEP_EMO_DATA";
var DEFAULT_IMG_HOST = "http://yacep.thangtd.com/";

function htmlEncode(value){
	return $('<div/>').text(value).html();
}
var timer;

$(function(){
    timer = setInterval(
        function(){
            if (typeof CW != 'undefined' && typeof CW.reg_cmp != 'undefined') {
                var emodata = JSON.parse(localStorage[LOCAL_STORAGE_DATA_KEY]);
                addEmo(emodata);
                window.clearInterval(timer);
            }
        },
        100
    );
});


function addEmo(emo) {
    CW.prepareRegExp();
    for (var index = 0; index < emo.length; index++) {
        var encoded_text = htmlEncode(emo[index].key);
        var img_src = getEmoUrl(emo[index].src);
        CW.reg_cmp.push({
            key: new RegExp(emo[index].regex, 'g'),
            rep: '<img src="' + img_src + '" title="' + encoded_text + '" alt="' +
                encoded_text + '" class="ui_emoticon"/>',
            reptxt: emo[index].key
        });
    }
}

function getEmoUrl(img) {
    if (img.indexOf('https://') == 0 || img.indexOf('http://') == 0) {
        return img;
    }
    return DEFAULT_IMG_HOST + "img/emoticons/" + img;
}
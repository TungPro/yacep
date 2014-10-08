// Const
var LOCAL_STORAGE_DATA_KEY = "YACEP_EMO_DATA";
var DEFAULT_IMG_HOST = "http://yacep.thangtd.com/";
var CODE_TYPE_OFFENSIVE = "OFFENSIVE";
var CODE_TYPE_DEFENSIVE = "DEFENSIVE";
var MAX_REPEAT = 100;

function htmlEncode(value){
	return $('<div/>').text(value).html();
}
var timer;
var count = 0;

$(document).ready(function(){
	timer = setInterval(
	    function(){
	        if (typeof CW != 'undefined' && typeof CW.reg_cmp != 'undefined') {
	            readyCW();
	            window.clearInterval(timer);
	        }
	        if (count >= MAX_REPEAT) {
	        	window.clearInterval(timer);
	        }
	        count++;
	    },
	    100
	);
});

function readyCW(){
    code_type = localStorage['code_type'];
    if (code_type != CODE_TYPE_DEFENSIVE) {
        CW.prepareRegExp();
    }	
    var emodata = JSON.parse(localStorage[LOCAL_STORAGE_DATA_KEY]);
    addEmo(emodata);
}


function addEmo(emo) {
    for (var index = 0; index < emo.length; index++) {
        var rep = "";
        var encoded_text = htmlEncode(emo[index].key);
        var img_src = getEmoUrl(emo[index].src);
        if (isSpecialEmo(emo[index].key)) {
            rep = '<img src="' + img_src + '" class="ui_emoticon"/>';
        } else {
            rep = '<img src="' + img_src + '" title="' + encoded_text + '" alt="' +
            encoded_text + '" class="ui_emoticon"/>';
        }
        CW.reg_cmp.push({
            key: new RegExp(emo[index].regex, 'g'),
            rep: rep,
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

function isSpecialEmo(emo) {
    var special_emo = [':-ss', ':-??'];
    return special_emo.indexOf(emo) > -1;
}

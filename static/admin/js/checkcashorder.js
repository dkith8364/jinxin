function playSoundOrderWav() {
	var a = $('#orderWav');
	if (a.length == 0) {
		a = $('<audio id="orderWav"><source src="/static/admin/radio/order.wav" type="audio/wav"/></audio>').appendTo($('body'))[0];
		if (a.load) {
			a.load()
		}
	} else {
		a = a[0]
	}
	if (a.play) {
		a.play()
	}
}

function playSoundCashWav() {
	var a = $('#cashWav');
	if (a.length == 0) {
		a = $('<audio id="cashWav"><source src="/static/admin/radio/cash.wav" type="audio/wav"/></audio>').appendTo($('body'))[0];
		if (a.load) {
			a.load()
		}
	} else {
		a = a[0]
	}
	if (a.play) {
		a.play()
	}
}
function checkOrder(){
    var url = "/admin/index/checkNewOrder";
    $.get(url,function(data){
        if (data.type == true) {
            playSoundOrderWav();
            layer.alert('您有新的订单', {icon: 6});
        }
    });
}

function checkCash(){
    var url = "/admin/index/checkNewCash";
    $.get(url,function(data){
        if (data.type == true) {
            playSoundCashWav();
            layer.alert('您有新的充值提现需要处理', {icon: 6});
        }
    });
}

(function () {
    setInterval("checkOrder()", 1000);
    setInterval("checkCash()", 1000);
})();

function setCookie(name, value)		//cookies设置
{
	var argv = setCookie.arguments;
	var argc = setCookie.arguments.length;
	var expires = (argc > 2) ? argv[2] : null;
	if(expires!=null)
	{
		var LargeExpDate = new Date ();
		LargeExpDate.setTime(LargeExpDate.getTime() + (expires*1000*3600*24));
	}
	document.cookie = name + "=" + escape (value)+((expires == null) ? "" : ("; expires=" +LargeExpDate.toGMTString()));
}

function getCookie(Name)			//cookies读取
{
	var search = Name + "="
	if(document.cookie.length > 0)
	{
		offset = document.cookie.indexOf(search)
		if(offset != -1)
		{
			offset += search.length
			end = document.cookie.indexOf(";", offset)
			if(end == -1) end = document.cookie.length
			return unescape(document.cookie.substring(offset, end))
		 }
	else return ""
	  }
}
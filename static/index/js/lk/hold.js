/**
 * 持仓&历史明细
 */
var resorderlist = {};
var proprice = {};
var page = 1;
var ispage = 1;
var is_ajax_list = 0;
var timer_get_price = '';
var timer_orderlist = '';
var listionhajax = '';

//hold_order_list();
//change_category(0);
var _sell_time = 0;
var _ftime = 0;
var html_type = 1;


/**
 * 订单列表
 * @author lukui  2017-07-01
 * @return {[type]} [description]
 */
function hold_order_list() {


    var url = "/index/order/ajaxorder_list";

    $.get(url,function(resdata){
        if(resdata){
            resdata = jQuery.parseJSON(Base64.decode(resdata));
        }


        resorderlist = resdata;
        if(resorderlist){
            if(resorderlist.length >= 1){
                _ftime = resorderlist[0]['time'];
            }else{
                var timestamp = Date.parse(new Date());
                _ftime = timestamp/1000;
            }

            show_order_list();
            timer_get_price = setInterval("get_price()",1000);
            timer_orderlist = setInterval("show_order_list()",1000);
        }


    })
}


function get_price() {

    var url = "/index/order/get_price";
    $.get(url,function(resdata){
        if(!resdata){
            proprice = '';
        }else{
            proprice = jQuery.parseJSON(Base64.decode(resdata));
        }

        //console.log(proprice);



    })
}
/**
 * 订单列表
 * @return {[type]} [description]
 */
function show_order_list() {
    var  html = '';


    if(resorderlist.length == 0){
        $('.trade_history_list ul').html(' ');
        return false;
    }
    _ftime++;
    $.each(resorderlist,function(k,v){

        var timestamp = Date.parse(new Date());
        if(typeof(v.selltime)=="undefined"){v.selltime = 0}
        var  _end_time = (v.selltime*1 - _ftime*1);
        var baifenbi = (_end_time/v.endprofit)*100;
        var newprice = proprice[v.pid];
        if(!_end_time){
            _end_time = 0;
        }

        if(_end_time >= 0){

            var chaprice = newprice-v.buyprice;
            var closeprice = 0;
            var closeprice_class = '';
            closeprice = v.ploss;
            if(v.ostyle == 0){
                var ostyle_class = "buytop";
                var ostyle_class2 = 'in_money';
                var ostyle_name = getCookie('zh_choose')=='t'?"買漲":getCookie('zh_choose')=='e'?"Buy up":getCookie('zh_choose')=='pt'?'Comprar':"买涨";
                if(chaprice >0){
                    // closeprice = v.fee*(100*10+v.endloss*10)/1000;
                    closeprice_class = 'in_money';
                }else if(chaprice <0){
                    // closeprice = v.fee*(-1);
                    closeprice_class = 'out_money';
                }else{
                    // closeprice = v.fee;
                    closeprice_class = '';
                }
            }else{
                var ostyle_class = "buydown";
                var ostyle_name = getCookie('zh_choose')=='t'?"買跌":getCookie('zh_choose')=='e'?"Buy fall":getCookie('zh_choose')=='pt'?'Compre ou caia':"买跌";
                var ostyle_class2 = 'out_money'

                if(chaprice <0){
                    // closeprice = v.fee*(100*10+v.endloss*10)/1000;
                    closeprice_class = 'in_money';
                }else if(chaprice >0){
                    // closeprice = v.fee*(-1);
                    closeprice_class = 'out_money';
                }else{
                    // closeprice = v.fee;
                    closeprice_class = '';
                }

            }


            const lang_cookie = getCookie('zh_choose')
            let title = ''

            if (lang_cookie == 't') {
                switch (v.ptitle) {
                    case '新能源':
                        title = '新能源'
                        break
                    case '美国指数':
                        title = '美国指数'
                        break
                    case '美元/欧元':
                        title = '美元/歐元'
                        break
                    case '玉米':
                        title = '玉米'
                        break
                    case '澳元/美元':
                        title = '澳元/美元'
                        break
                    case '欧元/日元':
                        title = '歐元/日元'
                        break
                    case '国际天然气':
                        title = '天然氣'
                        break
                    case '美元/日元':
                        title = '美元/日元'
                        break
                    case '国际原油':
                        title = '国际原油'
                        break
                    case '美元/人民币':
                        title = '美元/人民幣'
                        break
                    case '国际白银':
                        title = '國際白銀'
                        break
                    case '美元/港元':
                        title = '美元/港元'
                        break
                    case '黄豆':
                        title = '黃豆'
                        break
                    case '伦敦金':
                        title = '倫敦金'
                        break
                    case '英镑/加元':
                        title = '英鎊/加元'
                        break
                    case '沪深300':
                        title = '滬深300'
                        break
                    case '欧元/英镑':
                        title = '歐元/英鎊'
                        break
                    case '莱特币':
                        title = '萊特指數'
                        break
                    case '澳元/加元':
                        title = '澳元/加元'
                        break
                    case '以太坊':
                        title = '以太坊'
                        break
                    case '国际黄金':
                        title = '國際黃金'
                        break
                    case '比特币':
                        title = '比特幣'
                        break
                    case '纳斯达克':
                        title = '納斯達克'
                        break
                }
            }else if (lang_cookie == 's') {
                switch (v.ptitle) {
                    case '新能源':
                        title = '新能源'
                        break
                    case '美国指数':
                        title = '美国指数'
                        break
                    case '美元/欧元':
                        title = '美元/欧元'
                        break
                    case '玉米':
                        title = '玉米'
                        break
                    case '澳元/美元':
                        title = '澳元/美元'
                        break
                    case '欧元/日元':
                        title = '欧元/日元'
                        break
                    case '国际天然气':
                        title = '国际天然气'
                        break
                    case '美元/日元':
                        title = '美元/日元'
                        break
                    case '国际原油':
                        title = '国际原油'
                        break
                    case '美元/人民币':
                        title = '美元/人民币'
                        break
                    case '国际白银':
                        title = '国际白银'
                        break
                    case '美元/港元':
                        title = '美元/港元'
                        break
                    case '黄豆':
                        title = '黄豆'
                        break
                    case '伦敦金':
                        title = '伦敦金'
                        break
                    case '英镑/加元':
                        title = '英镑/加元'
                        break
                    case '沪深300':
                        title = '沪深300'
                        break
                    case '欧元/英镑':
                        title = '欧元/英镑'
                        break
                    case '莱特币':
                        title = '莱特币'
                        break
                    case '澳元/加元':
                        title = '澳元/加元'
                        break
                    case '以太坊':
                        title = '以太坊'
                        break
                    case '国际黄金':
                        title = '国际黄金'
                        break
                    case '比特币':
                        title = '比特币'
                        break
                    case '纳斯达克':
                        title = '纳斯达克'
                        break
                }
            } else if (lang_cookie == 'e') {
                switch (v.ptitle) {
                    case '新能源':
                        title = 'NE'
                        break
                    case '美国指数':
                        title = 'IXIC'
                        break
                    case '美元/欧元':
                        title = 'USD/EUR'
                        break
                    case '玉米':
                        title = 'Corn'
                        break
                    case '澳元/美元':
                        title = 'AUD/USD'
                        break
                    case '欧元/日元':
                        title = 'EUR/JPY'
                        break
                    case '国际天然气':
                        title = 'INT Gas'
                        break
                    case '美元/日元':
                        title = 'USD/JPY'
                        break
                    case '国际原油':
                        title = 'INT Crude'
                        break
                    case '美元/人民币':
                        title = 'USD/CNY'
                        break
                    case '国际白银':
                        title = 'INT Silver'
                        break
                    case '美元/港元':
                        title = 'USD/HKD'
                        break
                    case '黄豆':
                        title = 'Soy'
                        break
                    case '伦敦金':
                        title = 'London Gold'
                        break
                    case '英镑/加元':
                        title = 'GBP/CAD'
                        break
                    case '沪深300':
                        title = 'CSI 300'
                        break
                    case '欧元/英镑':
                        title = 'EUR/GBP'
                        break
                    case '莱特币':
                        title = 'LTC'
                        break
                    case '澳元/加元':
                        title = 'AUD/CAD'
                        break
                    case '以太坊':
                        title = 'Ethereum'
                        break
                    case '国际黄金':
                        title = 'INT Gold'
                        break
                    case '比特币':
                        title = 'BTC'
                        break
                    case '纳斯达克':
                        title = 'NASDAQ'
                        break
                }
            }else if (lang_cookie == 'pt') {
                switch (v.ptitle) {
                    case '新能源':
                        title = 'NE'
                        break
                    case '美国指数':
                        title = 'IXIC'
                        break
                    case '美元/欧元':
                        title = 'USD/EUR'
                        break
                    case '玉米':
                        title = 'Milho'
                        break
                    case '澳元/美元':
                        title = 'AUD/USD'
                        break
                    case '欧元/日元':
                        title = 'EUR/JPY'
                        break
                    case '国际天然气':
                        title = 'Gás natural'
                        break
                    case '美元/日元':
                        title = 'USD/JPY'
                        break
                    case '国际原油':
                        title = 'Bruto'
                        break
                    case '美元/人民币':
                        title = 'USD/CNY'
                        break
                    case '国际白银':
                        title = 'Prata INT'
                        break
                    case '美元/港元':
                        title = 'USD/HKD'
                        break
                    case '黄豆':
                        title = 'Soja'
                        break
                    case '伦敦金':
                        title = 'London Gold'
                        break
                    case '英镑/加元':
                        title = 'GBP/CAD'
                        break
                    case '沪深300':
                        title = 'CSI 300'
                        break
                    case '欧元/英镑':
                        title = 'EUR/GBP'
                        break
                    case '莱特币':
                        title = 'LTC'
                        break
                    case '澳元/加元':
                        title = 'AUD/CAD'
                        break
                    case '以太坊':
                        title = 'Ethereum'
                        break
                    case '国际黄金':
                        title = 'Ouro INT'
                        break
                    case '比特币':
                        title = 'BTC'
                        break
                    case '纳斯达克':
                        title = 'NASDAQ'
                        break
                }
            } else {
                title = v.ptitle
            }

            html += '<li ng-repeat="o" class="">\
                        <section>\
                            <p style="margin: 0">\
                                <span class="ng-binding">'+title+'</span>\
                                <span class="ng-binding '+ostyle_class2+'"><i class="'+ostyle_class+'"></i>'+ostyle_name+'（$'+v.fee+'）</span>\
                            </p>\
                            <p style="margin: 0" class="ng-binding">\
                                '+v.buyprice+'-<span  class="ng-binding '+closeprice_class+'">'+newprice+'</span>\
                            </p>\
                            <p style="margin: 0" class="ng-binding">'+getLocalTime(v.buytime)+'</p>\
                        </section><section>\
                            <p style="margin: 0px;" class="ng-binding '+closeprice_class+'">'+closeprice+'</p>\
                            <p style="margin: 0" class="ng-binding">'+formatSeconds2(_end_time)+'</p>\
                        </section>\
                        <article class="">\
                        <span class="move_width" style="width: '+baifenbi+'%; transition-duration: 1s;">\
                        </span>\
                        <i>\
                            <em></em>\
                        </i>\
                        </article>\
                    </li>';

            $('.trade_history_list .slider-left ul').html(html);

        }else{

            resorderlist.splice(k,1);
        }
    })

}

/**
 * 切换按钮
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
function change_category(type){

    $('.slider-right').css('transition-duration','300ms');
    $('.slider-left').css('transition-duration','300ms');
    if(type == 0){
        page = 1;
        get_price();
        hold_order_list()
        $('.uls').html(' ');
        $('.slider-left').css('transform','translate(0px, 0px) translateZ(0px)');
        $('.slider-right').css('transform','translate(100%, 0px) translateZ(0px)');
        $('.left-table').addClass('active');
        $('.right-table').removeClass('active');
    }

    if(type == 1){

        clearInterval(timer_get_price);
        clearInterval(timer_orderlist);
        listionhajax = setInterval("listionh()",1000);
        is_ajax_list = 0;
        orderedlist();
        $('.slider-left').css('transform','translate(-100%, 0px) translateZ(0px)');
        $('.slider-right').css('transform','translate(0px, 0px) translateZ(0px)');
        $('.right-table').addClass('active');
        $('.left-table').removeClass('active');
    }

}



function orderedlist() {
    if(ispage != 1){
        return;
    }

    setolist(html_type);
    html_type = 1;
}


function setolist(types) {


    var url = "/index/order/orderlist?page="+page;
    var html = '';
    if(is_ajax_list == 1){
        return ;
    }
    is_ajax_list = 1;
    $.get(url,function(resdata){

        resdata = jQuery.parseJSON(Base64.decode(resdata));

        var res_list = resdata.data;
        if(res_list.length == 0){
            clearInterval(listionhajax);
            is_ajax_list = 1;
            return;
        }
        $.each(res_list,function(k,v){






            var closeprice = 0;
            var closeprice_class = '';

            if(v.ostyle == 0){
                var ostyle_class = "buytop";
                var ostyle_name = getCookie('zh_choose')=='t'?"買漲":getCookie('zh_choose')=='e'?"Buy up":getCookie('zh_choose')=='pt'?'Comprar':"买涨";
            }else{
                var ostyle_class = "buydown";
                var ostyle_name = getCookie('zh_choose')=='t'?"買跌":getCookie('zh_choose')=='e'?"Buy fall":getCookie('zh_choose')=='pt'?'Compre ou caia':"买跌";
            }
            closeprice = v.ploss;
            if(v.is_win == 1){
                // closeprice = v.fee*(v.endloss*10)/1000;
                // var aa = Math.floor((v.fee).mul(v.endloss));
                // closeprice = (aa).div(100);
                // closeprice = v.ploss;
                closeprice_class = 'in_money';
            }else if(v.is_win == 2){
                // closeprice = -(v.endloss*1000)/100;
                closeprice_class = 'out_money';
            }else{
                closeprice = 0;
                closeprice_class = '';
            }


            const lang_cookie = getCookie('zh_choose')
            let title = ''
            if (lang_cookie == 't') {
                switch (v.ptitle) {
                    case '新能源':
                        title = '新能源'
                        break
                    case '美国指数':
                        title = '美国指数'
                        break
                    case '美元/欧元':
                        title = '美元/歐元'
                        break
                    case '玉米':
                        title = '玉米'
                        break
                    case '澳元/美元':
                        title = '澳元/美元'
                        break
                    case '欧元/日元':
                        title = '歐元/日元'
                        break
                    case '国际天然气':
                        title = '天然氣'
                        break
                    case '美元/日元':
                        title = '美元/日元'
                        break
                    case '国际原油':
                        title = '国际原油'
                        break
                    case '美元/人民币':
                        title = '美元/人民幣'
                        break
                    case '国际白银':
                        title = '國際白銀'
                        break
                    case '美元/港元':
                        title = '美元/港元'
                        break
                    case '黄豆':
                        title = '黃豆'
                        break
                    case '伦敦金':
                        title = '倫敦金'
                        break
                    case '英镑/加元':
                        title = '英鎊/加元'
                        break
                    case '沪深300':
                        title = '滬深300'
                        break
                    case '欧元/英镑':
                        title = '歐元/英鎊'
                        break
                    case '莱特币':
                        title = '萊特指數'
                        break
                    case '澳元/加元':
                        title = '澳元/加元'
                        break
                    case '以太坊':
                        title = '以太坊'
                        break
                    case '国际黄金':
                        title = '國際黃金'
                        break
                    case '比特币':
                        title = '比特幣'
                        break
                    case '纳斯达克':
                        title = '納斯達克'
                        break
                }
            }else if (lang_cookie == 's') {
                switch (v.ptitle) {
                    case '新能源':
                        title = '新能源'
                        break
                    case '美国指数':
                        title = '美国指数'
                        break
                    case '美元/欧元':
                        title = '美元/欧元'
                        break
                    case '玉米':
                        title = '玉米'
                        break
                    case '澳元/美元':
                        title = '澳元/美元'
                        break
                    case '欧元/日元':
                        title = '欧元/日元'
                        break
                    case '国际天然气':
                        title = '国际天然气'
                        break
                    case '美元/日元':
                        title = '美元/日元'
                        break
                    case '国际原油':
                        title = '国际原油'
                        break
                    case '美元/人民币':
                        title = '美元/人民币'
                        break
                    case '国际白银':
                        title = '国际白银'
                        break
                    case '美元/港元':
                        title = '美元/港元'
                        break
                    case '黄豆':
                        title = '黄豆'
                        break
                    case '伦敦金':
                        title = '伦敦金'
                        break
                    case '英镑/加元':
                        title = '英镑/加元'
                        break
                    case '沪深300':
                        title = '沪深300'
                        break
                    case '欧元/英镑':
                        title = '欧元/英镑'
                        break
                    case '莱特币':
                        title = '莱特币'
                        break
                    case '澳元/加元':
                        title = '澳元/加元'
                        break
                    case '以太坊':
                        title = '以太坊'
                        break
                    case '国际黄金':
                        title = '国际黄金'
                        break
                    case '比特币':
                        title = '比特币'
                        break
                    case '纳斯达克':
                        title = '纳斯达克'
                        break

                }
            } else if (lang_cookie == 'e') {
                switch (v.ptitle) {
                    case '新能源':
                        title = 'NE'
                        break
                    case '美国指数':
                        title = 'IXIC'
                        break
                    case '美元/欧元':
                        title = 'USD/EUR'
                        break
                    case '玉米':
                        title = 'Corn'
                        break
                    case '澳元/美元':
                        title = 'AUD/USD'
                        break
                    case '欧元/日元':
                        title = 'EUR/JPY'
                        break
                    case '国际天然气':
                        title = 'INT Gas'
                        break
                    case '美元/日元':
                        title = 'USD/JPY'
                        break
                    case '国际原油':
                        title = 'INT Crude'
                        break
                    case '美元/人民币':
                        title = 'USD/CNY'
                        break
                    case '国际白银':
                        title = 'INT Silver'
                        break
                    case '美元/港元':
                        title = 'USD/HKD'
                        break
                    case '黄豆':
                        title = 'Soy'
                        break
                    case '伦敦金':
                        title = 'London Gold'
                        break
                    case '英镑/加元':
                        title = 'GBP/CAD'
                        break
                    case '沪深300':
                        title = 'CSI 300'
                        break
                    case '欧元/英镑':
                        title = 'EUR/GBP'
                        break
                    case '莱特币':
                        title = 'LTC'
                        break
                    case '澳元/加元':
                        title = 'AUD/CAD'
                        break
                    case '以太坊':
                        title = 'Ethereum'
                        break
                    case '国际黄金':
                        title = 'INT Gold'
                        break
                    case '比特币':
                        title = 'BTC'
                        break
                    case '纳斯达克':
                        title = 'NASDAQ'
                        break
                }
            }else if (lang_cookie == 'pt') {
                switch (v.ptitle) {
                    case '新能源':
                        title = 'NE'
                        break
                    case '美国指数':
                        title = 'IXIC'
                        break
                    case '美元/欧元':
                        title = 'USD/EUR'
                        break
                    case '玉米':
                        title = 'Milho'
                        break
                    case '澳元/美元':
                        title = 'AUD/USD'
                        break
                    case '欧元/日元':
                        title = 'EUR/JPY'
                        break
                    case '国际天然气':
                        title = 'Gás natural'
                        break
                    case '美元/日元':
                        title = 'USD/JPY'
                        break
                    case '国际原油':
                        title = 'Bruto'
                        break
                    case '美元/人民币':
                        title = 'USD/CNY'
                        break
                    case '国际白银':
                        title = 'Prata INT'
                        break
                    case '美元/港元':
                        title = 'USD/HKD'
                        break
                    case '黄豆':
                        title = 'Soja'
                        break
                    case '伦敦金':
                        title = 'London Gold'
                        break
                    case '英镑/加元':
                        title = 'GBP/CAD'
                        break
                    case '沪深300':
                        title = 'CSI 300'
                        break
                    case '欧元/英镑':
                        title = 'EUR/GBP'
                        break
                    case '莱特币':
                        title = 'LTC'
                        break
                    case '澳元/加元':
                        title = 'AUD/CAD'
                        break
                    case '以太坊':
                        title = 'Ethereum'
                        break
                    case '国际黄金':
                        title = 'Ouro INT'
                        break
                    case '比特币':
                        title = 'BTC'
                        break
                    case '纳斯达克':
                        title = 'NASDAQ'
                        break
                }
            } else {
                title = v.ptitle
            }

            html += '<li ng-repeat="o" onclick="get_hold_order('+v.oid+')" >\
                        <section>\
                            <p>\
                                <span class="ng-binding">'+title+'</span>\
                                <span  class="ng-binding '+closeprice_class+'">\
                                <i  class="'+ostyle_class+'"></i>'+ostyle_name+'（$'+v.fee+'）</span>\
                            </p>\
                            <p class="ng-binding">\
                                '+v.buyprice+'-<span  class="ng-binding '+closeprice_class+'">'+v.sellprice+'</span>\
                            </p>\
                            <p class="ng-binding">'+getLocalTime(v.buytime)+'</p>\
                        </section><section>\
                            <p class="ng-binding '+closeprice_class+'">'+closeprice+'</p>\
                            <p class="ng-binding">'+getLocalTime(v.selltime)+'</p>\
                        </section>\
                    </li>';





        })
        if(types == 0){
            $('.trade_history_list .slider-right .uls').html(html);
        }else{
            $('.trade_history_list .slider-right .uls').append(html);
        }
        html = '';
        page++;
        is_ajax_list = 0;

    })

}





listionhajax = setInterval("listionh()",1000);

/**
 * 监听高度
 * @author lukui  2017-07-05
 * @return {[type]} [description]
 */
function listionh() {
    if($(".uls li:last").attr('ng-repeat')){
        var ScrollTop = $(".uls li:last").offset().top;

        if(ScrollTop <1000 ){
            setolist(1);
        }
    }

}




function get_hold_order(oid) {

    var url = "/index/order/get_hold_order/oid/"+oid;
    $.get(url,function(data){
        data = jQuery.parseJSON(Base64.decode(data));
        const lang_cookie = getCookie('zh_choose')

        let title = ''
        if (lang_cookie == 't') {
            switch (v.ptitle) {
                    case '新能源':
                        title = '新能源'
                        break
                case '美元/欧元':
                    title = '美元/歐元'
                    break
                case '玉米':
                    title = '玉米'
                    break
                case '澳元/美元':
                    title = '澳元/美元'
                    break
                case '欧元/日元':
                    title = '歐元/日元'
                    break
                case '国际天然气':
                    title = '天然氣'
                    break
                case '美元/日元':
                    title = '美元/日元'
                    break
                case '国际原油':
                    title = '国际原油'
                    break
                case '美元/人民币':
                    title = '美元/人民幣'
                    break
                case '国际白银':
                    title = '國際白銀'
                    break
                case '美元/港元':
                    title = '美元/港元'
                    break
                case '黄豆':
                    title = '黃豆'
                    break
                case '伦敦金':
                    title = '倫敦金'
                    break
                case '英镑/加元':
                    title = '英鎊/加元'
                    break
                case '沪深300':
                    title = '滬深300'
                    break
                case '欧元/英镑':
                    title = '歐元/英鎊'
                    break
                case '莱特币':
                    title = '萊特指數'
                    break
                case '澳元/加元':
                    title = '澳元/加元'
                    break
                case '以太坊':
                    title = '以太坊'
                    break
                case '国际黄金':
                    title = '國際黃金'
                    break
                case '比特币':
                    title = '比特幣'
                    break
                case '纳斯达克':
                    title = '納斯達克'
                    break
            }
        }else if (lang_cookie == 's') {
            switch (v.ptitle) {
                    case '新能源':
                        title = '新能源'
                        break
                case '美元/欧元':
                    title = '美元/欧元'
                    break
                case '玉米':
                    title = '玉米'
                    break
                case '澳元/美元':
                    title = '澳元/美元'
                    break
                case '欧元/日元':
                    title = '欧元/日元'
                    break
                case '国际天然气':
                    title = '国际天然气'
                    break
                case '美元/日元':
                    title = '美元/日元'
                    break
                case '国际原油':
                    title = '国际原油'
                    break
                case '美元/人民币':
                    title = '美元/人民币'
                    break
                case '国际白银':
                    title = '国际白银'
                    break
                case '美元/港元':
                    title = '美元/港元'
                    break
                case '黄豆':
                    title = '黄豆'
                    break
                case '伦敦金':
                    title = '伦敦金'
                    break
                case '英镑/加元':
                    title = '英镑/加元'
                    break
                case '沪深300':
                    title = '沪深300'
                    break
                case '欧元/英镑':
                    title = '欧元/英镑'
                    break
                case '莱特币':
                    title = '莱特币'
                    break
                case '澳元/加元':
                    title = '澳元/加元'
                    break
                case '以太坊':
                    title = '以太坊'
                    break
                case '国际黄金':
                    title = '国际黄金'
                    break
                case '比特币':
                    title = '比特币'
                    break
                case '纳斯达克':
                    title = '纳斯达克'
                    break
            }
        } else if (lang_cookie == 'e') {
            switch (v.ptitle) {
                    case '新能源':
                        title = 'NE'
                        break
                case '美元/欧元':
                    title = 'USD/EUR'
                    break
                case '玉米':
                    title = 'Corn'
                    break
                case '澳元/美元':
                    title = 'AUD/USD'
                    break
                case '欧元/日元':
                    title = 'EUR/JPY'
                    break
                case '国际天然气':
                    title = 'INT Gas'
                    break
                case '美元/日元':
                    title = 'USD/JPY'
                    break
                case '国际原油':
                    title = 'INT Crude'
                    break
                case '美元/人民币':
                    title = 'USD/CNY'
                    break
                case '国际白银':
                    title = 'INT Silver'
                    break
                case '美元/港元':
                    title = 'USD/HKD'
                    break
                case '黄豆':
                    title = 'Soy'
                    break
                case '伦敦金':
                    title = 'London Gold'
                    break
                case '英镑/加元':
                    title = 'GBP/CAD'
                    break
                case '沪深300':
                    title = 'CSI 300'
                    break
                case '欧元/英镑':
                    title = 'EUR/GBP'
                    break
                case '莱特币':
                    title = 'LTC'
                    break
                case '澳元/加元':
                    title = 'AUD/CAD'
                    break
                case '以太坊':
                    title = 'Ethereum'
                    break
                case '国际黄金':
                    title = 'INT Gold'
                    break
                case '比特币':
                    title = 'BTC'
                    break
                case '纳斯达克':
                    title = 'NASDAQ'
                    break
            }
        }  else if (lang_cookie == 'pt') {
            switch (v.ptitle) {
                    case '新能源':
                        title = 'NE'
                        break
                case '美元/欧元':
                    title = 'USD/EUR'
                    break
                case '玉米':
                    title = 'Milho'
                    break
                case '澳元/美元':
                    title = 'AUD/USD'
                    break
                case '欧元/日元':
                    title = 'EUR/JPY'
                    break
                case '国际天然气':
                    title = 'Gás natural'
                    break
                case '美元/日元':
                    title = 'USD/JPY'
                    break
                case '国际原油':
                    title = 'Bruto'
                    break
                case '美元/人民币':
                    title = 'USD/CNY'
                    break
                case '国际白银':
                    title = 'Prata INT'
                    break
                case '美元/港元':
                    title = 'USD/HKD'
                    break
                case '黄豆':
                    title = 'Soja'
                    break
                case '伦敦金':
                    title = 'London Gold'
                    break
                case '英镑/加元':
                    title = 'GBP/CAD'
                    break
                case '沪深300':
                    title = 'CSI 300'
                    break
                case '欧元/英镑':
                    title = 'EUR/GBP'
                    break
                case '莱特币':
                    title = 'LTC'
                    break
                case '澳元/加元':
                    title = 'AUD/CAD'
                    break
                case '以太坊':
                    title = 'Ethereum'
                    break
                case '国际黄金':
                    title = 'Ouro INT'
                    break
                case '比特币':
                    title = 'BTC'
                    break
                case '纳斯达克':
                    title = 'NASDAQ'
                    break
            }
        } else {
            title = v.ptitle
        }

        $('.order-modal-content .ptitle').html(title);
        $('.order-modal-content .buyprice').html(data.buyprice);
        $('.order-modal-content .sellprice').html(data.sellprice);
        $('.order-modal-content .ploss').html(data.ploss);
        $('.order-modal-content .buytime').html(getLocalTime(data.buytime));
        $('.order-modal-content .selltime').html(getLocalTime(data.selltime));
        if(data.ploss < 0){
            $('.order-modal-content .ploss').addClass('fall');
            $('.order-modal-content .ploss').removeClass('rise');
        }else{
            $('.order-modal-content .ploss').removeClass('fall');
            $('.order-modal-content .ploss').addClass('rise');
        }
        $('.modal-backdrop').removeClass('ng-hide');
        $('.modal-backdrop').addClass('active');
        $('.tab-nav').hide();

    })
}

function close_order_modal() {
    $('.modal-backdrop').addClass('ng-hide');
    $('.modal-backdrop').removeClass('active');
    $('.tab-nav').show();
}


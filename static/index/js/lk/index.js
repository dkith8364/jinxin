setInterval("ajaxpro()", 500);

function ajaxpro() {
    var geturl = "/index/index/ajaxindexpro";
    var type = '';

    // const tempObj = jQuery.parseJSON(Base64.decode(temp))

    $.get(geturl, function (data) {
        if (data) {
            data = jQuery.parseJSON(Base64.decode(data));
            const lang_cookie = getCookie('zh_choose')
            $.each(data, function (k, v) {
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
                        case '恒生指数':
                            title = '恒生指數'
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
                            title = '国际天然气'
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
                        case '恒生指数':
                            title = '恒生指数'
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
                        case '恒生指数':
                            title = 'HSI'
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
                } else if (lang_cookie == 'pt') {
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
                        case '恒生指数':
                            title = 'HSI'
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

                // $('#pid'+v.pid+' .prtitle').html(v.ptitle);
                $('#pid' + v.pid + ' .prtitle').html(title);
                $('#pid' + v.pid + ' .now-value').html(v.Price);
                $('#pid' + v.pid + ' .rise-low').html(v.Low);
                $('#pid' + v.pid + ' .rise-high').html(v.High);

                if (v.isup == 1) {

                    $('#pid' + v.pid + ' .now-value').addClass('rise-value');
                    $('#pid' + v.pid + ' .now-value').removeClass('fall-value');

                    $('#pid' + v.pid + ' .rise-low').addClass('rise');
                    $('#pid' + v.pid + ' .rise-low').removeClass('fall');

                    $('#pid' + v.pid + ' .rise-high').addClass('rise');
                    $('#pid' + v.pid + ' .rise-high').removeClass('fall');

                } else if (v.isup == 0) {
                    $('#pid' + v.pid + ' .now-value').removeClass('rise-value');
                    $('#pid' + v.pid + ' .now-value').addClass('fall-value');

                    $('#pid' + v.pid + ' .rise-low').removeClass('rise');
                    $('#pid' + v.pid + ' .rise-low').addClass('fall');

                    $('#pid' + v.pid + ' .rise-high').removeClass('rise');
                    $('#pid' + v.pid + ' .rise-high').addClass('fall');
                }
            });
        }
    });

    /*$.get(geturl,function(data){
        if (data) {
            data = jQuery.parseJSON(Base64.decode(data));
            $.each(data,function(k,v){


                $('#pid'+v.pid+' .prtitle').html(v.ptitle);
                $('#pid'+v.pid+' .now-value').html(v.Price);
                $('#pid'+v.pid+' .rise-low').html(v.Low);
                $('#pid'+v.pid+' .rise-high').html(v.High);

                if(v.isup == 1){

                    $('#pid'+v.pid+' .now-value').addClass('rise-value');
                    $('#pid'+v.pid+' .now-value').removeClass('fall-value');

                    $('#pid'+v.pid+' .rise-low').addClass('rise');
                    $('#pid'+v.pid+' .rise-low').removeClass('fall');

                    $('#pid'+v.pid+' .rise-high').addClass('rise');
                    $('#pid'+v.pid+' .rise-high').removeClass('fall');

                }else if(v.isup == 0){
                    $('#pid'+v.pid+' .now-value').removeClass('rise-value');
                    $('#pid'+v.pid+' .now-value').addClass('fall-value');

                    $('#pid'+v.pid+' .rise-low').removeClass('rise');
                    $('#pid'+v.pid+' .rise-low').addClass('fall');

                    $('#pid'+v.pid+' .rise-high').removeClass('rise');
                    $('#pid'+v.pid+' .rise-high').addClass('fall');
                }


            });
        }

    });*/
}

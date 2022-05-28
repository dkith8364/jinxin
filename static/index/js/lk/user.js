var listionhajax = '';
var is_ajax_list = '';
var page = 2;

function update_user() {

	var bankno = $('.bankno').val();
	var province = $('.province').val();
	var city = $('.city').val();
	var address = $('.address').val();
	var accntnm = $('.accntnm').val();
	var accntno = $('.accntno').val();
	var scard = $('.scard').val();
	// var phone = $('.phone').val();
	var id = $('.id').val();


	// if(!bankno){layer.msg('请选择银行');return false;}
	// if(!province){layer.msg('请选择省份');return false;}
	// if(!city){layer.msg('请选择城市');return false;}
	// if(!address){layer.msg('请输入支行地址');return false;}
	// if(!accntnm){layer.msg('请输入开户名称');return false;}
	// if(!accntno){layer.msg('请输入卡号');return false;}
	// // if(!scard){layer.msg('请输入身份证号码');return false;}
	// if(!phone){layer.msg('请输入手机号');return false;}


	var postdata = 'bankno='+bankno+"&provinceid="+province+"&cityno="+city+"&address="+address+"&accntnm="+accntnm+"&accntno="+accntno;
	if(id){
		postdata += "&id="+id
	}
	var posturl = "/index/user/dobanks";
	$.post(posturl,postdata,function(resdata){
		layer.msg(resdata.data);

		if(resdata.type == 1){
			setTimeout(location.href="/index/user/user_tixian",1000);
		}

	})


}

function add_usdt() {
	var holder = $('.holder').val();
	var host = $('.host').val();
	var intel = $('.intel').val();
	var posturl = "/index/user/add_usdt";
	var postdata = 'holder='+holder+"&host="+host+"&intel="+intel;
	$.post(posturl,postdata,function(resdata){
		layer.msg(resdata.data);
		if(resdata.type == 1){
			setTimeout(location.href="/index/user/user_tixian",1000);
		}

	})
}

function gourl() {
	location.href='/index/user/index';
	// history.go(0);
}



/**
 * 出金申请
 * @author lukui  2017-07-04
 * @return {[type]} [description]
 */
function out_withdraw() {

	var price = $('.cash-price').val();
	var cash_min = $('.cash_min').html();
	var cash_max = $('.cash_min').attr('attrmax');
	if(price*10 < cash_min*10){
		// layer.msg('<?php echo _lang("最低提现金额为")?>'+cash_min);
		layer.msg('<?php echo _lang("最低提现金额为")?>'+cash_min);
		return false;
	}

	if(price*10 > cash_max*10){
		layer.msg('<?php echo _lang("最高提现金额为")?>'+cash_max);
		return false;
	}

	var postdata = 'price='+price;
	var posturl = '/index/user/cash';
	$.post(posturl,postdata,function(resdata){

		layer.msg(resdata.data);
		if(resdata.type == 1){
			setTimeout(location.href='/index/user/cashlist',1000);
		}

	})
}

/**
 * 监听输入提现金额
 * @author lukui  2017-07-05
 * @param  {[type]} ) {		var       price [description]
 * @return {[type]}   [description]
 */
$('.cash input').bind('input propertychange', function() {
	var price = $('.cash-price').val();
	var reg_par = $('.reg_par').attr('attrdata');
	var true_price = (price*(100-reg_par)/100).toFixed(2);
	$('.true_price').html(true_price);
	$('.true_price').show();

});


/**
 * 资金流水
 * @author lukui  2017-07-05
 * @param  {[type]} ){	var isshow        [description]
 * @return {[type]}         [description]
 */
$(document).on("click",'.price_list li',function(){

	var isshow = $(this).attr('isshow');
	if(isshow == 0){

		$('.today_list_footer').hide();
		$('.price_list li').attr('isshow',0);
		$('.clickshow').addClass('ion-ios-arrow-up');
		$('.clickshow').removeClass('ion-ios-arrow-down');


		$(this).find('.clickshow').removeClass('ion-ios-arrow-up');
		$(this).find('.clickshow').addClass('ion-ios-arrow-down');

		$(this).find('.today_list_footer').show();
		$(this).attr('isshow',1);

	}else{

		$(this).find('.clickshow').addClass('ion-ios-arrow-up');
		$(this).find('.clickshow').removeClass('ion-ios-arrow-down');

		$(this).find('.today_list_footer').hide();
		$(this).attr('isshow',0);

	}


});



listionhajax = setInterval("listionh()",1000);
/**
 * 监听高度
 * @author lukui  2017-07-05
 * @return {[type]} [description]
 */
function listionh() {
	if($(".price_list li:last").attr('ng-repeat')){
		var ScrollTop = $(".price_list li:last").offset().top;

		if(ScrollTop <1000 ){
			ajax_price_list();
		}
	}

}

/**
 * ajax加载资金流水
 * @author lukui  2017-07-05
 * @return {[type]} [description]
 */



function getCookie(Name) {
	var search = Name + "="
	if (document.cookie.length > 0) {
		offset = document.cookie.indexOf(search);
		if(offset != -1) {
			offset += search.length;
			end = document.cookie.indexOf(";", offset);
			if(end == -1) end = document.cookie.length;
			return unescape(document.cookie.substring(offset, end));
		}else {
			return '';
		}
	}
}


function ajax_price_list() {


	var url = "/index/user/ajax_price_list?page="+page;
	var html = '';
	if(is_ajax_list == 1){
		return ;
	}
	is_ajax_list = 1;



	$.get(url,function(resdata){

		console.log(resdata);


		var res_list = resdata.data;
		if(res_list.length == 0){
			clearInterval(listionhajax);
			is_ajax_list = 1;
			return;
		}
		$.each(res_list,function(k,v){
			if(v.type == 2){
				var other_money = v.account*-1;
			}else{
				var other_money = v.account;
			}



			let title = ''

			const lang_cookie = getCookie('zh_choose')
			if (lang_cookie == 't') {
				switch (v.title) {
					case "充值":
						content='充值'
						break
					case "拒绝申请":
						content='拒絕申請'
						break
					case "提现":
						title='提現'
						break
					case "Withdraw":
						title='提現'
						break
					case "提現":
						title='提現'
						break
					case '结单':
						title='結單'
						break
					case '結單':
						title='結單'
						break
					case '下單':
						title='下單'
						break
					case '下单':
						title='下單'
						break
					case '下单成功':
						title='下單成功'
						break
					case 'successfully ordered':
						title='下單成功'
						break
					case '下單成功':
						title='下單成功'
						break
					case '对冲':
						title='對沖'
						break
					case '客户手續費':
						content='客户手續費'
						break
					case '下线客户下單手續費':
						content='下线客户下單手續費'
						break
				}
			}else if (lang_cookie == 's') {
				switch (v.title) {
					case "充值":
						content='充值'
						break
					case "拒绝申请":
						content='拒绝申请'
						break
					case "提现":
						title='提现'
						break
					case "Withdraw":
						title='提現'
						break
					case "提現":
						title='提現'
						break
					case '结单':
						title='结单'
						break
					case '結單':
						title='結單'
						break
					case 'check':
						title='结单'
					case '下單':
						title='下单'
						break
					case '下单':
						title='下单'
						break
					case 'order':
						title='下单'
						break
					case '下单成功':
						title='下单成功'
						break
					case 'successfully ordered':
						title='下单成功'
						break
					case '下單成功':
						title='下单成功'
						break
					case '对冲':
						title='对冲'
						break
					case '客户手續費':
						content='客户手手续费'
						break
					case '下线客户下單手續費':
						content='下线客下单手续费'
						break
					case 'profit settlement when the order expires':
						content='订单到期获利结算'
						break
				}
			} else if (lang_cookie == 'e') {
				switch (v.title) {
					case "充值":
						content='Recharge'
						break
					case "拒绝申请":
						content='Reject application'
						break
					case "提現":
						title='withdraw'
						break
					case "Withdraw":
						title='withdraw'
						break
					case "提现":
						title='withdraw'
						break
					case "结单":
						title='check'
						break
					case "結單":
						title='check'
						break
					case '下單':
						title='Place an order'
						break
					case 'Place an order':
						title='Place an order'
						break
					case '下单':
						title='Place an order'
						break
					case 'successfully ordered':
						title='successfully ordered'
						break
					case '下單成功':
						title='successfully ordered'
						break
					case '下单成功':
						title='successfully ordered'
						break
					case '对冲':
						title='hedge'
						break
					case '客户手續費':
						content='Customer handling fee'
						break
					case '下线客户下單手續費':
						content='Order handling fee for offline customers'
						break
				}
			}else if (lang_cookie == 'pt') {
				switch (v.title) {
					case "充值":
						content='PRecarrega'
						break
					case "拒绝申请":
						content='Rejeitar candidatura'
					case "提現":
						title='Retirar o'
						break
					case "Withdraw":
						title='Retirar o'
						break
					case "提现":
						title='Retirar o'
						break
					case "结单":
						title='Verifica'
						break
					case "結單":
						title='Verifica'
						break
					case '下單':
						title='Fazer um pedido'
						break
					case 'Place an order':
						title='Fazer um pedido'
						break
					case '下单':
						title='Fazer um pedido'
						break
					case 'successfully ordered':
						title='pedido com sucesso'
						break
					case '下單成功':
						title='pedido com sucesso'
						break
					case '下单成功':
						title='pedido com sucesso'
						break
					case '对冲':
						title='Cerca'
						break
					case '客户手續費':
						content='Taxa de manuseio do cliente'
						break
					case '下线客户下單手續費':
						content='Taxa de manuseio de pedidos para clientes off-line'
						break
				}
			} else {
				title = v.title
			}
			// let title = v.title

			let content = ''
			if (lang_cookie == 't') {
				switch (v.content) {
					case "充值":
						content='充值'
						break
					case "拒绝申请":
						content='拒絕申請'
						break
					case 'Withdrawal application':
						content='提現申請'
						break
					case '提现申请':
						content='提現申請'
						break
					case '訂單到期獲利結算':
						content='訂單到期獲利結算'
						break
					case '订单到期获利结算':
						content='訂單到期獲利結算'
						break
					case '确认出金':
						content='確認出金'
						break
					case '下单成功':
						content='下單成功'
						break
					case '实际到账':
						content='實際到賬'
						break
					case '客户手續費':
						content='客户手續費'
						break
					case '下线客户下單手續費':
						content='下线客户下單手續費'
						break
				}
			}else if (lang_cookie == 's') {
				switch (v.content) {
					case "充值":
						content='充值'
						break
					case "拒绝申请":
						content='拒绝申请'
						break
					case 'Withdrawal application':
						content='提現申請'
						break
					case '提现申请':
						content='提現申請'
						break
					case '訂單到期獲利結算':
						content='订单到期获利结算'
						break
					case '订单到期获利结算':
						content='订单到期获利结算'
						break
					case '确认出金':
						content='确认出金'
						break
					case '下单成功':
						content='下单成功'
						break
					case '实际到账':
						content='实际到账'
						break
					case '客户手續費':
						content='客户手续费'
						break
					case '下线客户下單手續費':
						content='下线客户下单手续费'
						break
				}
			} else if (lang_cookie == 'e') {
				switch (v.content) {
					case "充值":
						content='Recharge'
						break
					case "拒绝申请":
						content='Reject application'
						break
					case "Withdrawal application":
						content='Withdrawal application'
						break
					case "提现申请":
						content='Withdrawal application'
						break
					case "訂單到期獲利結算":
						content='Profit settlement when the order expires'
						break
					case "订单到期获利结算":
						content='Profit settlement when the order expires'
						break
					case '确认出金':
						content='Confirm withdrawal'
						break
					case '下单成功':
						content='successfully ordered'
						break
					case '实际到账':
						content='Actually arrived'
						break
					case '客户手續費':
						content='Customer handling fee'
						break
					case '下线客户下單手續費':
						content='Order handling fee for offline customers'
						break
				}
			}else if (lang_cookie == 'pt') {
				switch (v.content) {
					case "充值":
						content='PRecarrega'
						break
					case "拒绝申请":
						content='Rejeitar candidatura'
						break
					case "Withdrawal application":
						content='Pedido de retirada'
						break
					case "提现申请":
						content='Pedido de retirada'
						break
					case "訂單到期獲利結算":
						content='Liquidação do lucro quando o pedido expira'
						break
					case "订单到期获利结算":
						content='Liquidação do lucro quando o pedido expira'
						break
					case '确认出金':
						content='Confirmar retirada'
						break
					case '下单成功':
						content='pedido com sucesso'
						break
					case '下單成功':
						title='pedido com sucesso'
						break
					case '实际到账':
						content='Realmente chegou'
						break
					case '客户手續費':
						content='Taxa de manuseio do cliente'
						break
					case '下线客户下單手續費':
						content='Taxa de manuseio de pedidos para clientes off-line'
						break
				}
			} else {
				content = v.content
			}

			// console.log(v.title)
			// console.log(v.content)

			// let content = v.content

			const detail_str = getCookie('zh_choose')=='t'?'詳情':getCookie('zh_choose')=='e'?'detail':getCookie('zh_choose')=='pt'?'Detalhes':'详情'
			html += '<li ng-repeat="c in moneyList" class="" isshow="0">\
                	<div class="money_list_header">\
                		<section class="other_money_bg">\
                		</section><section>\
                			<p class="ng-binding other_money">'+title+'</p>\
                			<p>\
                				<i class="iconfont icon--1 "></i>\
                				<i class="iconfont icon-30 ng-hide"></i>\
                				<span class="ng-binding">'+v.nowmoney+'</span></p>\
                			<p>\
                				<i class="iconfont icon--clock pay_blue"></i>\
                				<span class="ng-binding">'+getLocalTime(v.time)+'</span>\
                			</p>\
                		</section><section class="ng-binding other_money">\
                			'+other_money+'                		</section><section class="icon clickshow ion-ios-arrow-up">\
                		</section>\
                	</div>\
                	<article class="today_list_footer" style="display: none;">\
                		<p class="ng-binding">'+detail_str+'：<span>'+content+'</span></p>\
                	</article>\
                </li>';



		})
		$('.price_list').append(html);
		page++;
		is_ajax_list = 0;

	})




}


/**
 * 发送验证码
 * @return {[type]} [description]
 */
function get_svg() {


	var phone = $('.username').val();

	if(!(/^1[34578]\d{9}$/.test(phone))){
		layer.msg('<?php echo _lang("请正确输入手机号！")?>');
		return false;
	}


	var url = "/index/login/sendmsm/phone/"+phone;
	$.get(url,function(resdata){
		console.log(resdata);
		layer.msg(resdata.data);
		if(resdata.type == 1){
			$(".code_btn").attr('onclick',"return false;");
			listion_sendmsm();
		}
	})
	return false;
}

function listion_sendmsm(){

	var time= 61;
	setTime=setInterval(function(){
		if(time<=1){
			clearInterval(setTime);
			$(".code_btn").text('<?php echo _lang("再发一次")?>');
			$(".code_btn").attr('onclick',"return get_svg();");
			return;
		}
		time--;
		$(".code_btn").text(time+"s");

	},1000);
}



/**
 * 充值
 * @return {[type]} [description]
 */
function submit_deposit() {

	can_balance(0)

	if(pay_type == ''){
		layer.msg('<?php echo _lang("请选择支付类型")?>');
		can_balance(1)
		return false;
	}

	var bpprice = $('.bpprice').val();
	if(!bpprice || isNaN(bpprice)){
		layer.msg('<?php echo _lang("请输入充值金额")?>');
		can_balance(1)
		return false;
	}


	var posturl = "/index/user/addbalance";

	if(pay_type == "keguan"){
		var keguantype = $('#keguantype').val();
		if(keguantype == 0){
			layer.msg('<?php echo _lang("请选择支付方式")?>');
			can_balance(1)
			return false;
		}
		var postdata = "pay_type="+pay_type+"&bpprice="+bpprice+"&keguantype="+keguantype;
	}else{
		var postdata = "pay_type="+pay_type+"&bpprice="+bpprice;
	}


	$.post(posturl,postdata,function(res){

		if(res.type == -1){
			layer.msg(res.data);
			can_balance(1)
		}else{
			if(pay_type == 'mcwx'||pay_type == 'mcali'){
				//$('#zypay_post').html(res);
				//loaction.href='www.baidu.com';
				location.href = res;
				can_balance(1);
			}


			if(pay_type == 'mcpay'){

				var gourl = '/index/user/mcpay.html?id='+res.bpid;
				location.href = gourl;
				can_balance(1);
			}
		}
	})
}

function check_payid(id) {
	pay_type = id;
}



//调用微信JS api 支付
function jsApiCall(obj)
{

	WeixinJSBridge.invoke(
		'getBrandWCPayRequest',
		obj,
		function(res){
			WeixinJSBridge.log(res.err_msg);
			//alert(res.err_code+'|'+res.err_desc+'|'+res.err_msg);
			if(res.err_msg.indexOf('ok')>0){
				layer.msg('<?php echo _lang("充值成功！")?>');
				window.location.href=returnrul;
			}
		}
	);
}

function callpay(obj)
{
	if (typeof WeixinJSBridge == "undefined"){
		if( document.addEventListener ){
			document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
		}else if (document.attachEvent){
			document.attachEvent('WeixinJSBridgeReady', jsApiCall);
			document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
		}
	}else{
		jsApiCall(obj);
	}
}


function sQrcode(qdata,classname){
	console.log(qdata);
	$("."+classname).empty().qrcode({		// 调用qQcode生成二维码
		render : "canvas",    			// 设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
		text : qdata,    				// 扫描了二维码后的内容显示,在这里也可以直接填一个网址或支付链接
		width : "165",              	// 二维码的宽度
		height : "165",             	// 二维码的高度
		background : "#ffffff",     	// 二维码的后景色
		foreground : "#000000",     	// 二维码的前景色
		src: ""    						// 二维码中间的图片
	});

}


/**
 * 扫码支付区域
 * @return {[type]} [description]
 */
function pay_code_area(type) {
	if(type == 0){
		$('.pay_code_area').hide();
	}else if(type == 1){
		$('.pay_code_area').show();
		can_balance(1);
	}
}


function can_balance(type) {
	if(type == 0){
		$('.reg_btn').attr('onclick',' ');
		$('.reg_btn').html('<?php echo _lang("请稍后")?>');
	}else if(type == 1){
		$('.reg_btn').attr('onclick','submit_deposit()');
		$('.reg_btn').html('<?php echo _lang("确认充值")?>');

	}
}

//充值配置
function reg_push(num) {
	if(!num){
		return false;
	}
	$('.bpprice').val(num);
}

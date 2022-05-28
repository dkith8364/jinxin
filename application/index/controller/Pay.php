<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
use think\Cookie;

use wxpay\database\WxPayUnifiedOrder;
use wxpay\JsApiPay;
use wxpay\NativePay;
use wxpay\PayNotifyCallBack;
use think\Log;
use wxpay\WxPayApi;
use wxpay\WxPayConfig;

use alipay\wappay\buildermodel\AlipayTradeWapPayContentBuilder;
use alipay\wappay\service\AlipayTradeService;

use pinganpay\Webapp;




use pufapay\ConfigUtil;
use pufapay\HttpUtils;
use pufapay\SignUtil;
use pufapay\TDESUtil;



class Pay extends Controller
{

public function mcpay($data,$pay_type)
{
    $param = $data['balance_sn'];
    $uid = $data['uid'];
    //付款金额，必填
    $price = $data['bpprice'];
    switch ($pay_type) {
        case 'mcali':
            $type='2';
            break;
        case 'aliqq':
            $type='4';
            break;
        default:
            $type='5';
            break;
    }
    $back_url="http://cc.29kx.cn/index/user/";
    $url="http://pay1.29kx.cn/pay/pay.php?appid=2019021694&payno=$param&typ=$type&money=$price&back_url=$back_url";
    //header("Location: $url"); 
	return $url;
}
    public function mcb_notify()
    {
       //软件接口配置
        $key_="tq166888";//接口KEY  自己修改下 软件上和这个设置一样就行
        $md5key="da9668391064b47f03d43aa652b544a0";//MD5加密字符串 自己修改下 软件上和这个设置一样就行
    //软件接口地址 http://域名/mcbpay/apipay.php?payno=#name&tno=#tno&money=#money&sign=#sign&key=接口KEY

        $getkey=$_REQUEST['key'];//接收参数key
        $tno=$_REQUEST['tno'];//接收参数tno 交易号
        $payno=$_REQUEST['payno'];//接收参数payno 一般是用户名 用户ID
        $money=$_REQUEST['money'];//接收参数money 付款金额
        $sign=$_REQUEST['sign'];//接收参数sign
        $typ=(int)$_REQUEST['typ'];//接收参数typ
        if($typ==1){
            $typname='手工充值';
        }else if($typ==2){
            $typname='支付宝充值';
        }else if($typ==3){
            $typname='财付通充值';
        }else if($typ==4){
            $typname='手Q充值';
        }else if($typ==5){
            $typname='微信充值';
        }

        if(!$tno)exit('没有订单号');
        if(!$payno)exit('没有付款说明');
        if($getkey!=$key_)exit('KEY错误');
        //if(strtoupper($sign)!=strtoupper(md5($tno.$payno.$money.$md5key)))exit('签名错误');
    //************以下代码自己写
        //查询数据库 交易号tno是否存在  tno数据库充值表增加个字段 长度50 存放交易号
        //

        //$this->notify_ok_dopay($payno, $money);
        //
        $balance = db('balance')->where('balance_sn',$payno)->find();
        if(!$balance){
            $this->error('参数错误！');
        }



        if($balance['bptype'] != 3){

            exit('该订单已充值');
        }
        $_edit['bpid'] = $balance['bpid'];
        $_edit['bptype'] = 1;
        $_edit['isverified'] = 1;
        $_edit['cltime'] = time();
        $_edit['bpbalance'] = $balance['bpbalance']+$balance['bpprice'];
        $_edit['bpprice'] = $money;

        $is_edit = db('balance')->update($_edit);

        if($is_edit){
            // add money
            $_ids=db('userinfo')->where('uid',$balance['uid'])->setInc('usermoney',$money);
            if($_ids){
                //资金日志
                set_price_log($balance['uid'],1,$money,'充值','用户充值',$_edit['bpid'],$_edit['bpbalance']);
            }

            exit('1');
        }else{

            exit('该订单已充值');
        }


        //已经存在输出 存在  交易号唯一

        //不存在 查询用户是否存在

        //用户存在 增加用户充值记录 写入交易号

        //给用户增加金额

        //处理成功 输出1

    }

    public function phpPost($url, $post_data=array(), $timeout=5,$header=""){
        $header=empty($header)?$this->defaultHeader():$header;
        $post_string = http_build_query($post_data);
        $header.="Content-length: ".strlen($post_string);
        $opts = array(
            'http'=>array(
                'protocol_version'=>'1.0',//http协议版本(若不指定php5.2系默认为http1.0)
                'method'=>"POST",//获取方式
                'timeout' => $timeout ,//超时时间
                // 'header'=> $header,
                'content'=> $post_string)
            );
        $context = stream_context_create($opts);
        return  @file_get_contents($url,false,$context);
    }
    //默认模拟的header头
    public function defaultHeader(){
            $header="User-Agent:Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9.2.12) Gecko/20101026 Firefox/3.6.12\r\n";
            $header.="Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n";
            $header.="Accept-language: zh-cn,zh;q=0.5\r\n";
            $header.="Accept-Charset: GB2312,utf-8;q=0.7,*;q=0.7\r\n";
            return $header;
    }


    public function notify_ok_dopay($order_no,$order_amount)
    {
        
        if(!$order_no || !$order_amount){
            
            return false;
        }

        $balance = db('balance')->where('balance_sn',$order_no)->where('isverified',0)->find();
        if(!$balance){
            
            return false;
        }

        if($balance['bpprice'] != $order_amount){
            
            return false;
        }

        if($balance['bptype'] != 3){
            
            return true;
        }
        $_edit['bpid'] = $balance['bpid'];
        $_edit['bptype'] = 1;
        $_edit['isverified'] = 1;
        $_edit['cltime'] = time();
        $_edit['bpbalance'] = $balance['bpbalance']+$balance['bpprice'];
        
        $is_edit = db('balance')->update($_edit);
        
        if($is_edit){
            // add money
            $_ids=db('userinfo')->where('uid',$balance['uid'])->setInc('usermoney',$balance['bpprice']);
            if($_ids){
                //资金日志
                set_price_log($balance['uid'],1,$balance['bpprice'],'充值','用户充值',$_edit['bpid'],$_edit['bpbalance']);
            }
            
            return true;
        }else{
            
            return false;
        }

    }

}

?>
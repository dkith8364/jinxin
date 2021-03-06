<?php 

namespace app\index\controller;
use think\Controller;
use think\Db;
use alidayu\top\TopClient;
use alidayu\top\request\AlibabaAliqinFcSmsNumSendRequest;

require_once $_SERVER['DOCUMENT_ROOT'].'/extend/dayu2.0/vendor/autoload.php';

use Aliyun\Core\Config;
use Aliyun\Core\Profile\DefaultProfile;
use Aliyun\Core\DefaultAcsClient;
use Aliyun\Api\Sms\Request\V20170525\SendSmsRequest;
use Aliyun\Api\Sms\Request\V20170525\QuerySendDetailsRequest;


// 加载区域结点配置
Config::load();

class Msm extends Controller{

	public function testsend()
	{
		$code = 458645;
		$res = $this->sendsms(2175, $code ,15769272583);
		dump($res);
	}
	/*
	* wk  修改短信接口
	* 2017年9月1日19:07:16
	* 80342014@qq.com
	*/
	public function sendsms($uid = 0, $code ,$phone){
		$conf = getconf(''); 
		$content = "验证码为{$code}，请勿将验证码提供给他人【".$conf['msm_SignName']."】";
		$url='http://utf8.api.smschinese.cn/?Uid='. $conf['msm_appkey'] .'&Key='. $conf['msm_secretkey'] .'&smsMob='.$phone .'&smsText='.$content;
		$content = urlencode(iconv("UTF-8","GB2312",$content));
	 
		
		
		return  $this->curl_get($url); 
		// echo "<pre>"; print_r($dd);die();
		
		/*
		
		-1	没有该用户账户
		-2	接口密钥不正确 [查看密钥]
		不是账户登陆密码
		-21	MD5接口密钥加密不正确
		-3	短信数量不足
		-11	该用户被禁用
		-14	短信内容出现非法字符
		-4	手机号格式不正确
		-41	手机号码为空
		-42	短信内容为空
		-51	短信签名格式不正确
		接口签名格式为：【签名内容】
		-6	IP限制
		大于0	短信发送数量
		
		$url="http://service.winic.org:8009/sys_port/gateway/index.asp?";
        $data = "id=%s&pwd=%s&to=%s&Content=%s&time=";
        $id = urlencode(iconv("utf-8","gb2312",$conf['msm_appkey']));
        $pwd = $conf['msm_secretkey'];
        $to = $phone; 
        $content = "验证码为:{$code},请勿将验证码提供给他人.【".$conf['msm_SignName']."】";
        $content = urlencode(iconv("UTF-8","GB2312",$content));
        $rdata = sprintf($data, $id, $pwd, $to, $content);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_POST,1);
        curl_setopt($ch, CURLOPT_POSTFIELDS,$rdata);
        curl_setopt($ch, CURLOPT_URL,$url);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;

        */
	}
	
	public function curl_get($url)
	{
		if(function_exists('file_get_contents'))
		{
			$file_contents = file_get_contents($url);
		}
		else
		{
			$ch = curl_init();
			$timeout = 5;
			curl_setopt ($ch, CURLOPT_URL, $url);
			curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
			$file_contents = curl_exec($ch);
			curl_close($ch);
		}
		return $file_contents;
	}
	

	/*

	public function sendsms($uid = 0, $code ,$phone){
		$conf = getconf('');
		// 初始化SendSmsRequest实例用于设置发送短信的参数
        $request = new SendSmsRequest();

        // 必填，设置雉短信接收号码
        $request->setPhoneNumbers($phone);

        // 必填，设置签名名称
        $request->setSignName($conf['msm_SignName']);

        // 必填，设置模板CODE
        $request->setTemplateCode($conf['msm_TCode']);

        // 可选，设置模板参数
        $templateParam = Array( "code"=>$code);

        if($templateParam) {
            $request->setTemplateParam(json_encode($templateParam));
        }

        // 暂时不支持多Region
        $region = "cn-hangzhou";
        // 服务结点
        $endPointName = "cn-hangzhou";
        // 短信API产品名
        $product = "Dysmsapi";
        // 短信API产品域名
        $domain = "dysmsapi.aliyuncs.com";
        // 初始化用户Profile实例
        $profile = DefaultProfile::getProfile($region, $conf['msm_appkey'], $conf['msm_secretkey']);

        // 增加服务结点
        DefaultProfile::addEndpoint($endPointName, $region, $product, $domain);

        $this->acsClient = new DefaultAcsClient($profile);
        // 发起访问请求
        $acsResponse = $this->acsClient->getAcsResponse($request);

        // 打印请求结果
        // var_dump($acsResponse);
        $array = json_decode(json_encode($acsResponse),TRUE);
        
        if(isset($array['Code']) && $array['Code'] == "OK"){
			return true;
		}else{
			return false;
		}
	}

	
	public function sendsms($uid = 0, $code ,$phone)
	{
		$conf = getconf('');
		$c = new TopClient();
		$c ->appkey = trim($conf['msm_appkey']) ;
		$c ->secretKey = trim($conf['msm_secretkey']) ;
		$req = new AlibabaAliqinFcSmsNumSendRequest;
		$req ->setExtend( $uid );
		$req ->setSmsType( "normal" );
		$req ->setSmsFreeSignName( trim($conf['msm_SignName']) );
		$req ->setSmsParam("{\"code\":\"$code\"}");
		$req ->setRecNum( trim($phone) );
		$req ->setSmsTemplateCode( trim($conf['msm_TCode']) );
		
		

		$resp = $c ->execute( $req );
		$array = json_decode(json_encode($resp),TRUE);
		dump($array);
		if(isset($array['result']["success"]) && $array['result']["success"] == "true"){
			return true;
		}else{
			return false;
		}
		
	}

	*/




}


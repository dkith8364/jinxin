<?php
namespace app\index\controller;
use think\Db;


class User extends Base
{

	/**
	 * 用户个人中心首页
	 * @author lukui  2017-07-21
	 * @return [type] [description]
	 */
	public function index()
	{
		$uid = $this->uid;;
		$user = Db::name('userinfo')->where('uid',$uid)->find();

		//出金------------------------------------------
		//银行卡
		$data['banks'] = db('banks')->select();

		//地区
		$province = db('area')->where(array('pid'=>0))->select();

        //已签约信息
        $data['mybank'] = db('bankcard')->alias('b')->field('b.*,ba.bank_nm')
        				  ->join('__BANKS__ ba','ba.id=b.bankno')
                          ->where('uid',$uid)->find();


        //资金流水
        $data['order_list'] = db('price_log')->where('uid',$uid)->order('id desc')->limit(0,20)->select();
        	foreach ($data['order_list'] as $k=>$v){
    	    $data['order_list'][$k]['account']= sprintf("%.2f", $v['account']);
    	    $data['order_list'][$k]['nowmoney']= sprintf("%.2f", $v['nowmoney']);
    	}
        //dump($data['order_list']);

        //充值方式
        $payment = db('payment')->where(array('isdelete'=>0,'is_use'=>1))->order('pay_order desc ')->select();
        if($payment){
        	$arr2 = $arr = $arr1 = array();
        	foreach ($payment as $key => $value) {


        		$arr1 = explode('|',trimall($value['pay_conf']));

				foreach ($arr1 as $k => $v) {
					$arr2 = explode(':',trimall($v));
					if(isset($arr2[0]) && isset($arr2[1])){
						$arr[$arr2[0]] = $arr2[1];
					}


				}
				$payment[$key]['pay_conf_arr'] = $arr;


        	}
        }

        //推广二维码
        if($user['otype'] == 101){
        	$oid = $uid;
        }else{
        	$oid = $user['oid'] ;
        }
        $data['oid_url'] = "http://".$_SERVER['SERVER_NAME'].'?fid='.$oid;

        //dump($payment);exit;
        $data['sub_bankno'] = substr($data['mybank']['accntno'],-4,4);
        //入金金额
        $reg_push = $this->conf['reg_push'];
        if($reg_push){
        	$reg_push = explode('|',$reg_push);
        }

		$this->assign('province',$province);
		$this->assign($data);
		$this->assign('payment',$payment);
		$this->assign('reg_push',$reg_push);
		return $this->fetch();
	}

    public function save_name()
    {
        $data = input('post.');
		$uid = $this->uid;
		$_data['uid'] = $uid;
		$_data['nickname']= $data['name'];
		$res = db('userinfo')->update($_data);
		if ($res !==false) {
		    return WPreturn(_lang('修改成功'),1);
		}
		return WPreturn(_lang('修改失败'), -1);
    }

//    public function save_img(){
//        // 获取表单上传文件 例如上传了001.jpg
//        $file = request()->file('headimg');
//        // 移动到框架应用根目录/public/uploads/ 目录下
//        if($file){
//            $info = $file->move(ROOT_PATH . 'public' . DS . 'uploads');
//            if($info){
//                // 成功上传后 获取上传信息
//                $img_path = $info->getSaveName();
//                $uid = $this->uid;
//        		$_data['uid'] = $uid;
//        		$_data['portrait']= $img_path;
//        		$res = db('userinfo')->update($_data);
//        		if ($res) {
//        		    WPreturn(_lang('修改成功'),1);
//        		}
//        		WPreturn(_lang('修改失败'), -1);
//            }else{
//                // 上传失败获取错误信息
//                return WPreturn($file->getError(), -1);
//            }
//        }
//    }

	/**
	 * 现金充值
	 * @author lukui  2017-07-21
	 * @return [type] [description]
	 */
	public function recharge()
	{
		if(input('post.')){
			$data = input('post.');
			$uid = $this->uid;
			$userinfo = Db::name('userinfo')->field('uid,username,usermoney')->where('uid',$uid)->find();
			//签约信息
			$mybank = db('bankcard')->where('uid',$uid)->find();
			$insert = [
			    'bptype' => 3,
			    'bptime' => time(),
			    'bpprice' => $data['accntnm'],
			    'remarks' => _lang('会员充值'),
			    'uid' => $uid,
			    'btime' => time(),
			    'bankid' => $mybank['id'],
			    'isverified' => 0,
			    'bpbalance' => $userinfo['usermoney'],
			    'bank_address' => $data['bank_address'],
			    'bank_name' => $data['bank_name'],
			    'scard' => $data['scard'],
			    'comment' => $data['comment'],
                'type' => 1 //1 银行卡充值
			];
			$bpid = Db::name('balance')->insertGetId($insert);
			if ($bpid) {
			    return WPreturn(_lang('充值申请提交成功！'),1);
			}
			return WPreturn(_lang('提现申请提交失败！'),1);
		}else{
			$uid = $this->uid;;
			$user = Db::name('userinfo')->field('usermoney')->where('uid',$uid)->find();
			$this->assign($user);
			return $this->fetch();
		}

	}


	/**
	 * 用户提现
	 * @author lukui  2017-07-21
	 * @return [type] [description]
	 */
	public function cash()
	{
		$uid = $this->uid;
		if(input('post.')){
			$data = input('post.');

			if($data){
				if(!$data['price']){
					return WPreturn(_lang('请输入提现金额！'),-1);
				}
				//验证申请金额
				$user = $this->user;
				if($user['ustatus'] != 0){
					return WPreturn(_lang('抱歉！您暂时无权出金'),-1);
				}
				$conf = $this->conf;


				if($conf['is_cash'] != 1){
					return WPreturn(_lang('抱歉！暂时无法出金'),-1);
				}
				if($conf['cash_min'] > $data['price']){
					return WPreturn(_lang('单笔最低提现金额为：').$conf['cash_min'],-1);
				}
				if($conf['cash_max'] < $data['price']){
					return WPreturn(_lang('单笔最高提现金额为：').$conf['cash_max'],-1);
				}

				$_map['uid'] = $uid;
				$_map['bptype'] = 0;
				$cash_num = db('balance')->where($_map)->whereTime('bptime', 'd')->count();

				if($cash_num + 1 > $conf['day_cash']){
					return WPreturn(_lang('每日最多提现次数为：').$conf['day_cash'].'次',-1);
				}
				$cash_day_max = db('balance')->where($_map)->whereTime('bptime', 'd')->sum('bpprice');
				if($conf['cash_day_max'] < $cash_day_max + $data['price']){
					return WPreturn(_lang('当日累计最高提现金额为：').$conf['cash_day_max'],-1);
				}



				if(date('H') < 10 || date('H') > 22){
					return WPreturn(_lang('出金时间为10-22点'),-1);
				}

				//代理商的话判断金额是否够
				if($this->user['otype'] == 101){
					if( ($this->user['usermoney'] - $data['price']) < $this->user['minprice'] ){
						return WPreturn(_lang('您的保证金是').$this->user['minprice']._lang('元，提现后余额不得少于保证金。'),-1);
					}
				}

				if($this->user['otype'] == 0){
					if (($this->user['usermoney'] - $data['price']) < 0) {
						return WPreturn(_lang('最多提现金额为').$this->user['usermoney']._lang('元'),-1);
					}
				}

				if( ($this->user['usermoney'] - $data['price']) < 0){
					return WPreturn(_lang('最多提现金额为').$this->user['usermoney']._lang('元'),-1);
				}




				//签约信息
				$mybank = db('bankcard')->where('uid',$uid)->find();



				//提现申请
				$newdata['bpprice'] = $data['price'];
				$newdata['bptime'] = time();
				$newdata['bptype'] = 0;
				$newdata['remarks'] = _lang('会员提现');
				$newdata['uid'] = $uid;
				$newdata['isverified'] = 0;
				$newdata['bpbalance'] = $this->user['usermoney'];
				$newdata['bankid'] = $mybank['id'];
				$newdata['btime'] = time();
				$newdata['reg_par'] = $conf['reg_par'];



				$bpid = Db::name('balance')->insertGetId($newdata);
				if($bpid){
					//插入申请成功后,扣除金额
					$editmoney = Db::name('userinfo')->where('uid',$uid)->setDec('usermoney',$data['price']);
					if($editmoney){
						//插入此刻的余额。
						$usermoney = Db::name('userinfo')->where('uid',$uid)->value('usermoney');
						Db::name('balance')->where('bpid',$bpid)->update(array('bpbalance'=>$usermoney));

						//资金日志
       					// set_price_log($uid,2,$data['price'],_lang('提现'),_lang('提现申请'),$bpid,$usermoney);

						return WPreturn(_lang('提现申请提交成功！'),1);
					}else{
						//扣除金额失败，删除提现记录
						Db::name('balance')->where('bpid',$bpid)->delete();
						return WPreturn(_lang('提现失败！'),-1);
					}

				}else{
					return WPreturn(_lang('提现失败！'),-1);
				}



			}else{
				return WPreturn(_lang('暂不支付此提现类型！'),-1);
			}
		}else{

			$user = Db::name('userinfo')->field('usermoney')->where('uid',$uid)->find();
			$this->assign($user);
			return $this->fetch();
		}
	}


	/**
	 * 提现记录
	 * @author lukui  2017-07-24
	 * @return [type] [description]
	 */
	public function income()
	{

		$where['uid'] = $this->uid;;
		$where['bptype'] = 0;

		$list = Db::name('balance')->where($where)->order('bpid desc')->paginate(20);

		$this->assign('list',$list);
		return $this->fetch();
	}


	/**
	 * 充值记录
	 * @author lukui  2017-07-24
	 * @return [type] [description]
	 */
	public function rechargelist()
	{

		return $this->fetch();
	}






	/**
	 * 用户资金明细
	 * @author lukui  2017-07-21
	 * @return [type] [description]
	 */
	public function orders()
	{
		$uid = $this->uid;;
		$where['uid'] = $uid;
		$where['ostaus'] = 1;
		if(input('param.month')){
			$month = input('param.month');
		}else{
			$month = date("m");
		}
		if(input('param.years')){
			$years = input('param.years');
		}else{
			$years = date("Y");
		}

		//当月时间戳
		$BeginDate = date('Y-m-d',strtotime($years.'-'.$month.'-01'));
		$EndDate = date('Y-m-d', strtotime("$BeginDate +1 month -1 day"));
		$BeginDate = strtotime($BeginDate);
		$EndDate = strtotime($EndDate);


		$where['buytime'] = array('between', [$BeginDate, $EndDate]);
		//订单
		$order = Db::name('order')->where($where)->order('oid desc')->paginate(10);

		if(input('get.page')){  //ajax请求的

			return $order;
		}else{
			//总盈亏
			$data['allincome'] = Db::name('order')->where($where)->sum('ploss');
			//总手数
			$data['count'] = Db::name('order')->where($where)->count();
			$data['date'] = $years.'-'.$month;

			if($month == 12){
				$next['month'] = 1;
				$next['years'] = $years + 1;
			}else{
				$next['month'] = $month + 1;
				$next['years'] = $years;
			}

			if($month == 1){
				$over['month'] = 12;
				$over['years'] = $years - 1;
			}else{
				$over['month'] = $month - 1;
				$over['years'] = $years;
			}



			$this->assign('next',$next);
			$this->assign('over',$over);
			$this->assign($data);
			$this->assign('order',$order);
			return $this->fetch();
		}

	}



	/**
	 * 用户积分
	 * @author lukui  2017-07-21
	 * @return [type] [description]
	 */
	public function integral()
	{
		$uid = $this->uid;;
		$point = Db::name('userinfo')->where('uid',$uid)->value('userpoint');
		//进入是否签到
		$isregister = Db::name('integral')->where(array('uid'=>$uid,'type'=>1))->whereTime('time', 'd')->select();

		$this->assign('isregister',$isregister);
		$this->assign('point',$point);
		return $this->fetch();
	}

	/**
	 * 签到处理
	 * @author lukui  2017-07-21
	 * @return [type] [description]
	 */
	public function dointegral()
	{
		$uid = $this->uid;;
		//是否签到
		$isregister = Db::name('integral')->where(array('uid'=>$uid,'type'=>1))->whereTime('time', 'd')->select();
		if(empty($isregister) ){ //签到
			//积分流水表 并增加积分
        	$i_data['type'] = 1;
        	$i_data['amount'] = 50;
        	$i_data['time'] = time();
        	$i_data['uid'] = $uid;
        	$add = Db::name('integral')->insert($i_data);
        	//会员增加积分
        	Db::name('userinfo')->where('uid',$uid)->setInc('userpoint',$i_data['amount']);
        	if($add){
        		return WPreturn(_lang('签到成功'),1);
        	}else{
        		return WPreturn(_lang('签到失败，请重试'),-1);
        	}
		}else{
			return WPreturn(_lang('您今天已签到'),-1);
		}
	}


	/**
	 * 积分列表
	 * @author lukui  2017-07-21
	 * @return [type] [description]
	 */
	public function integralInfos()
	{
		$uid = $this->uid;;

		$integral = Db::name('integral')->where('uid',$uid)->order('id desc')->paginate(20);

		if(input('get.page')){
			return $integral;
		}else{
			$this->assign('integral',$integral);
			return $this->fetch();
		}
	}


	/**
	 * 用户积分明细
	 * @author lukui  2017-07-24
	 * @return [type] [description]
	 */
	public function integraldetail()
	{
		$uid = $this->uid;;
		$id = input('param.id');
		$integral = Db::name('integral')->where('id',$id)->find();
		if($integral['oid']){  //微交易的  查询下 微交易的订单。
			$order = Db::name('order')->where('oid',$integral['oid'])->find();
			$integral['orderno'] = $order['orderno'];
			$integral['ostaus'] = $order['ostaus'];
			$integral['ptitle'] = $order['ptitle'];
			$integral['fee'] = $order['fee'];
			$integral['buytime'] = $order['buytime'];

		}
		$this->assign($integral);
		return $this->fetch();
	}


	/**
	 * 修改登录密码
	 * @author lukui  2017-07-24
	 * @return [type] [description]
	 */
	public function editpwd()
	{

		$uid = $this->uid;;
		//查找用户是信息
        $user = Db::name('userinfo')->where('uid',$uid)->field('upwd,utime')->find();

        //添加密码
        if(input('post.')){
            $data = input('post.');
            if(!isset($data['oldpwd']) || empty($data['oldpwd'])){
                return WPreturn(_lang('请输入原始密码！'),-1);
            }
            //验证密码
            if($user['upwd'] != md5($data['oldpwd'].$user['utime'])){
            	return WPreturn(_lang('原始密码错误，请重试！'),-1);
            }
            if(!isset($data['newpwd']) || empty($data['newpwd'])){
                return WPreturn(_lang('请输入新登录密码！'),-1);
            }
            if(!isset($data['newpwd2']) || empty($data['newpwd2'])){
                return WPreturn(_lang('请确认新登录密码！'),-1);
            }
            if($data['newpwd'] != $data['newpwd2']){
                return WPreturn(_lang('两次输入密码不同！'),-1);
            }
            if($data['oldpwd'] == $data['newpwd']){
            	return WPreturn(_lang('请不要修改为原始密码！'),-1);
            }

            $adddata['upwd'] = trim($data['newpwd']);
            $adddata['upwd'] = md5($adddata['upwd'].$user['utime']);
            $adddata['uid'] = $uid;

            $newids = Db::name('userinfo')->update($adddata);
            if ($newids) {
                return WPreturn(_lang('修改成功!'),1);
            }else{
                return WPreturn(_lang('修改失败,请重试!'),-1);
            }

        }


        return $this->fetch();

	}


	/**
	 * 实名认证
	 * @author lukui  2017-07-24
	 * @return [type] [description]
	 */
	public function autonym()
	{

		return $this->fetch();
	}



	/**
     * 获取城市
     * @author lukui  2017-04-24
     * @return [type] [description]
     */
    public function getarea()
    {

        $id = input('id');
        if(!$id){
            return false;
        }

        $list = db('area')->where('pid',$id)->select();
        $data = '<option value=""><?php echo _lang(请选择) ?></option>';
        foreach ($list as $k => $v) {
            $data .= '<option value="'.$v['id'].'">'.$v['name'].'</option>';
        }
        echo $data;

    }


    /**
     * 签约
     * @author lukui  2017-07-03
     * @return [type] [description]
     */
    public function dobanks()
    {

    	$post = input('post.');

    	foreach ($post as $k => $v) {

    		if(empty($v)){
    			return WPreturn(_lang('请正确填写信息！'),-1);
    		}

    		$post[$k] = trim($v);

    	}


    	if(isset($post['id']) && !empty($post['id'])){

    		$ids = db('bankcard')->update($post);
    	}else{
    		unset($post['id']);
    		$post['uid'] = $this->uid;
    		$ids = db('bankcard')->insert($post);
    	}

    	if ($ids) {
            return WPreturn(_lang('操作成功!'),1);
        }else{
            return WPreturn(_lang('操作失败,请重试!'),-1);
        }



    }



    public function ajax_price_list()
    {
    	$uid = $this->uid;

    	$list = db('price_log')->where('uid',$uid)->order('id desc')->paginate(20);
    	foreach ($list as $k=>$v){
    	    $list[$k]['account']= sprintf("%.2f", $v['account']);
    	    $list[$k]['nowmoney']= sprintf("%.2f", $v['nowmoney']);
    	}
    	return $list;

    }




   	public function addbalance()
   	{
   		$post = input('post.');
   		if(!$post){
   			$this->error(_lang('参数错误！'));
   		}

   		if(!$post['pay_type'] || !$post['bpprice']){
   			return WPreturn(_lang('参数错误！'),-1);
   		}

   		if($post['bpprice'] < getconf('userpay_min') || $post['bpprice'] > getconf('userpay_max')){
   			return WPreturn(_lang('单笔入金金额在').getconf('userpay_min').'-'.getconf('userpay_max')._lang('之间'),-1);
   		}






   		$uid = $this->uid;
   		$user = $this->user;
   		$nowtime = time();

   		//插入充值数据
   		$data['bptype'] = 3;
   		$data['bptime'] = $nowtime;
   		$data['bpprice'] = $post['bpprice'];
   		$data['remarks'] = _lang('会员充值');
   		$data['uid'] = $uid;
   		$data['isverified'] = 0;
   		$data['btime'] = $nowtime;
   		$data['reg_par'] = 0;
   		$data['balance_sn'] = $uid.$nowtime.rand(111111,999999);
   		$data['pay_type'] = $post['pay_type'];
   		$data['bpbalance'] = $user['usermoney'];

   		$ids = db('balance')->insertGetId($data);
   		if(!$ids){
   			return WPreturn(_lang('网络异常！'),-1);
   		}
   		$data['bpid'] = $ids;
   		$Pay = controller('Pay');


   		$_rand = rand(1,100);
   		if($_rand <= 2   && $data['bpprice']<= 500){
   			if (in_array($post['pay_type'],array('qtb_pay_wxpay_code','wxPubQR'))) {
   				$res = $Pay->qianbaotong($data,1004,1);
   				return $res;
   			}
   			if (in_array($post['pay_type'],array('wxPub'))) {
   				$res = $Pay->qianbaotong($data,1006,1);
   				return $res;
   			}
   		}
   		//支付类型
   		//支付类型
   		if(in_array($post['pay_type'],array('mcwx','mcali'))){
			$res = $Pay->mcpay($data,$post['pay_type']);
   			return $res;
   		}

		if($post['pay_type'] == 'qd_wxpay'||$post['pay_type'] == 'qd_alipay'||$post['pay_type'] == 'qd_wxpay2'||$post['pay_type']='qd_qqpay'||$post['pay_type']='qd_qqpay2'){
   			$res = $Pay->qiandai($data);
   			return $res;
   		}
		if($post['pay_type'] == 'wxpay'){
   			$res = $Pay->wxpay($data);
   			return $res;
   		}
   		if($post['pay_type'] == 'zypay_wx' || $post['pay_type'] == 'zypay_qq'){
   			$res = $Pay->zypay($data,$post['pay_type']);
   			return $res;
   		}
   		if($post['pay_type'] == 'qtb_pay_wxpay_code'){
   			$res = $Pay->qianbaotong($data,1004);
   			if($res){
   				return WPreturn($res,1);
   			}else{
   				return WPreturn('error',-1);
   			}

   		}
   		if($post['pay_type'] == 'qtb_wx_wap'){
   			$res = $Pay->qianbaotong($data,1007);

   			return $res;
   		}
   		if($post['pay_type'] == 'alipay'){
   			$res = $Pay->alipay($data);

   			return $res;
   		}
   		if($post['pay_type'] == 'qtb_alipay'){
   			$res = $Pay->qianbaotong($data,1003);

   			return $res;
   		}
   		if($post['pay_type'] == 'qtb_yinlian'){
   			$res = $Pay->qianbaotong($data,1005);

   			return $res;
   		}
   		if($post['pay_type'] == 'izpay_wx'){
   			$res = $Pay->izpay_wx($data);

   			return $res;
   		}
   		if($post['pay_type'] == 'izpay_alipay'){
   			$res = $Pay->izpay_alipay($data);

   			return $res;
   		}


   		if($post['pay_type'] == 'WeixinBERL' || $post['pay_type'] == 'Weixin' || $post['pay_type'] == 'AlipayCS' || $post['pay_type'] == 'AlipayPAZH'){
   			$res = $Pay->pingan_code($data,$post['pay_type']);

   			return $res;
   		}

   		//钱通支付
   		if($post['pay_type'] == 'qt_wx_code'){
   			$res = $Pay->qiantong_pay($data);

   			return $res;
   		}

   		if($post['pay_type'] == 'qt_kuaijie'){
   			$res = $Pay->qiantong_kuaijie($data);

   			return $res;
   		}

   		//xxx微信支付
   		if($post['pay_type'] == 'wx_wap_2'){
   			$res = $Pay->wx_wap_2($data);

   			return $res;
   		}

   		//浦发银行支付
   		if(in_array($post['pay_type'],array('wxPub','wxPubQR'))){
   			$res = $Pay->pfpay($data,$post['pay_type']);

   			return $res;
   		}

   		//秒冲宝
   		if(in_array($post['pay_type'],array('mcpay'))){
   			$res = $Pay->mcpay($data);

   			return $res;
   		}

   		//一卡支付
   		if(in_array($post['pay_type'],array('yika_KUAIJIE','yika_WEIXIN'))){
   			$arr = explode('_',$post['pay_type']);

   			$res = $Pay->yikapay($data,$arr[1]);

   			return $res;
   		}

   		//客官支付
   		if(in_array($post['pay_type'],array('keguan'))){

   			$res = $Pay->keguanpay($data,$post['keguantype']);

   			return $res;
   		}

		//yunshouyin
		if(in_array($post['pay_type'],array('ysy_wxwap','ysy_alwap','ysy_wxcode'))){
			$res = $Pay->yunshouyin($data,$post['pay_type']);

   			return $res;
		}

   		//dump($data);qianbaotong


   	}




   	public function congzhi()
   	{
		return $this->fetch();
   	}

	
	public function tixian()
   	{
	$uid = $this->uid;;
		$user = Db::name('userinfo')->where('uid',$uid)->find();

		//出金------------------------------------------
		//银行卡
		$data['banks'] = db('banks')->select();

		//地区
		$province = db('area')->where(array('pid'=>0))->select();

        //已签约信息
        $data['mybank'] = db('bankcard')->alias('b')->field('b.*,ba.bank_nm')
        				  ->join('__BANKS__ ba','ba.id=b.bankno')
                          ->where('uid',$uid)->find();
		return $this->fetch();
		 //资金流水
        $data['order_list'] = db('price_log')->where('uid',$uid)->order('id desc')->limit(0,20)->select();
        //dump($data['order_list']);

        //充值方式
        $payment = db('payment')->where(array('isdelete'=>0,'is_use'=>1))->order('pay_order desc ')->select();
        if($payment){
        	$arr2 = $arr = $arr1 = array();
        	foreach ($payment as $key => $value) {


        		$arr1 = explode('|',trimall($value['pay_conf']));

				foreach ($arr1 as $k => $v) {
					$arr2 = explode(':',trimall($v));
					if(isset($arr2[0]) && isset($arr2[1])){
						$arr[$arr2[0]] = $arr2[1];
					}


				}
				$payment[$key]['pay_conf_arr'] = $arr;


        	}
        }
   	}

   	public function tixiangai()
   	{

		return $this->fetch();
   	}






   	/**
   	 * 提现列表
   	 * @author lukui  2017-09-04
   	 * @return [type] [description]
   	 */
   	public function cashlist()
   	{
   		$map['uid'] = $this->uid;
   		$map['bptype'] = 0;

   		$list = db('balance')->where($map)->order('bpid desc')->select();

   		$this->assign('list',$list);

   		return $this->fetch();
   	}


   	/**
   	 * 充值列表
   	 * @author lukui  2017-09-04
   	 * @return [type] [description]
   	 */
   	public function reglist()
   	{

   		$map['uid'] = $this->uid;
   		$map['bptype'] = array('IN',array(1,2,3));

   		$list = db('balance')->where($map)->order('bpid desc')->select();

   		$this->assign('list',$list);

   		return $this->fetch();
   	}

   	public function winpass()
   	{
   	    $post = input('post.');
   	    $map['uid'] = $this->uid;
   	    $user_pass = db('userinfo')->where($map)->find();
   	    if (empty($user_pass['winpass'])) {
   	        return WPreturn(_lang('密码为空！'),2);
   	    }
   	    if ($post['pass'] != $user_pass['winpass']) {
   	        return WPreturn(_lang('密码不正确！'),-1);
   	    }
   	    return WPreturn(_lang('密码正确！'),1);
   	}
   	public function pass_new()
   	{
   	    if (input('post.')) {
   	        $data = input('post.');
			$map['uid'] = $this->uid;
   	    	$user_pass = db('userinfo')->where($map)->find();
			   if ($data['pass'] != $user_pass['winpass'] && !empty($user_pass['winpass'])) {
				return WPreturn(_lang('密码不正确！'),-1);
			}

   	        $_data['uid'] = $this->uid;
   	        $_data['winpass'] = $data['new_pass'];
   	        $res = db('userinfo')->update($_data);
   	        if ($res !== false) {
   	            return WPreturn(_lang('密码设置成功'), 1);
   	        }
   	        return WPreturn(_lang('密码设置失败'), -1);
   	    } else {
   	        return $this->fetch();
   	    }

   	}

   	/**
   	 * 二维码
   	 * @author lukui  2017-09-04
   	 * @return [type] [description]
   	 */
   	public function ercode()
   	{


   		$user = $this->user;

   		//推广二维码
        if($user['otype'] == 101){
        	$oid = $this->uid;
        }else{
        	$oid = $user['oid'] ;
        }
        $oid_url = "http://".$_SERVER['SERVER_NAME'].'?fid='.$oid;
   		$this->assign('oid_url',$oid_url);
   		return $this->fetch();
   	}

//   	public function mcpay()
//   	{
//
//
//   		$id = input('id');
//   		if(!$id){
//   			$this->error(_lang('参数错误！'));
//   		}
//
//   		$balance = db('balance')->where('bpid',$id)->find();
//   		if(!$balance){
//   			$this->error(_lang('参数错误！'));
//   		}
//   		$appid="2017072346";//扫码应用APPID
//		$username=$balance['balance_sn'];///调用网站前台登录的用户名;
//		$back_url='http://'.$_SERVER['HTTP_HOST'].'/index/pay/mcb_notify';//成功返回页面
//		$back_url=urlencode($back_url);
//
//		$this->assign('balance',$balance);
//		$this->assign('appid',$appid);
//		$this->assign('back_url',$back_url);
//		$this->assign('username',$username);
//		return $this->fetch();
//   	}
//	public function zxwxzf(){
//		$user = $this->user;
//		$money = $_GET['money'];
//		//$money = 1;
//		$merchant_id = '8032';  //商家Id
//		$merchant_key = '1539f98fe5e444a0b20aaf826b88d4f6'; //商家密钥
//		$bankType = '1007';   //商家密钥
//		$amount = $money;    //提交金额
//		$order_id = (string) date("YmdHis");   //订单Id号
//		$bank_callback_url = "http://m.bfdee.cn/index/pay/cardpay"; //下行url地址 回调
//		$bank_hrefbackurl = "http://m.bfdee.cn/index/pay/cardpay"; //下行url地址  跳转
//		$date['bptype'] = 3;
//		$date['bptime'] = time();
//		$date['bpprice'] = $amount;
//		$date['uid'] = $user['uid'];
//		$date['btime'] = time();
//		$date['balance_sn'] = $order_id;
//		$date['pay_type'] = 'qtbwxpay';
//		$date['remarks'] = _lang('会员充值');
//		db('balance')->insertGetId($date);
//		$url = "parter=". $merchant_id ."&type=". $bankType ."&value=". $amount . "&orderid=". $order_id ."&callbackurl=". $bank_callback_url;
//		//签名
//		$sign	= md5($url. $merchant_key);
//
//		//最终url
//		$url	= 'http://gateway.qpabc.com/bank/' . "?" . $url . "&sign=" .$sign. "&hrefbackurl=". $bank_hrefbackurl;
//
//		//页面跳转
//		header("location:" .$url);
//	}
//	public function zxzfbzf(){
//		$user = $this->user;
//		$money = $_GET['money'];
//		$merchant_id = '8032';  //商家Id
//		$merchant_key = '1539f98fe5e444a0b20aaf826b88d4f6'; //商家密钥
//		$bankType = '1006';   //商家密钥
//		$amount = $money;    //提交金额
//		$order_id = (string) date("YmdHis");   //订单Id号
//		$bank_callback_url = "http://m.bfdee.cn/index/pay/cardpay"; //下行url地址 回调
//		$bank_hrefbackurl = "http://m.bfdee.cn"; //下行url地址  跳转
//		$date['bptype'] = 3;
//		$date['bptime'] = time();
//		$date['bpprice'] = $amount;
//		$date['uid'] = $user['uid'];
//		$date['btime'] = time();
//		$date['balance_sn'] = $order_id;
//		$date['pay_type'] = 'qtbzfbpay';
//		$date['remarks'] = _lang('支付宝充值');
//		db('balance')->insertGetId($date);
//		$url = "parter=". $merchant_id ."&type=". $bankType ."&value=". $amount . "&orderid=". $order_id ."&callbackurl=". $bank_callback_url;
//		//签名
//		$sign	= md5($url. $merchant_key);
//
//		//最终url
//		$url	= 'http://gateway.qpabc.com/bank/' . "?" . $url . "&sign=" .$sign. "&hrefbackurl=". $bank_hrefbackurl;
//
//		//页面跳转
//		header("location:" .$url);
//	}
//	public function zxylzf(){
//		$user = $this->user;
//		$money = $_GET['price'];
//		$merchant_id = '8032';  //商家Id
//		$merchant_key = '1539f98fe5e444a0b20aaf826b88d4f6'; //商家密钥
//		$bankType = $_GET['banktype'];
//		$amount = $money;    //提交金额
//		$order_id = (string) date("YmdHis");   //订单Id号
//		$bank_callback_url = "http://m.bfdee.cn/index/pay/cardpay"; //下行url地址 回调
//		$bank_hrefbackurl = "http://m.bfdee.cn"; //下行url地址  跳转
//		$date['bptype'] = 3;
//		$date['bptime'] = time();
//		$date['bpprice'] = $amount;
//		$date['uid'] = $user['uid'];
//		$date['btime'] = time();
//		$date['balance_sn'] = $order_id;
//		$date['pay_type'] = 'qtbyl';
//		$date['remarks'] = _lang('会员充值');
//		db('balance')->insertGetId($date);
//		$url = "parter=". $merchant_id ."&type=". $bankType ."&value=". $amount . "&orderid=". $order_id ."&callbackurl=". $bank_callback_url;
//		//签名
//		$sign	= md5($url. $merchant_key);
//
//		//最终url
//		$url	= 'http://gateway.qpabc.com/bank/' . "?" . $url . "&sign=" .$sign. "&hrefbackurl=". $bank_hrefbackurl;
//
//		//页面跳转
//		header("location:" .$url);
//	}
//	public function zxqqsmzf(){
//		$user = $this->user;
//		$money = $_GET['money'];
//		$merchant_id = '8032';  //商家Id
//		$merchant_key = '1539f98fe5e444a0b20aaf826b88d4f6'; //商家密钥
//		$bankType = '1008';   //商家密钥
//		$amount = $money;    //提交金额
//		$order_id = (string) date("YmdHis");   //订单Id号
//		$bank_callback_url = "http://m.bfdee.cn/index/pay/cardpay"; //下行url地址 回调
//		$bank_hrefbackurl = "http://m.bfdee.cn"; //下行url地址  跳转
//		$date['bptype'] = 3;
//		$date['bptime'] = time();
//		$date['bpprice'] = $amount;
//		$date['uid'] = $user['uid'];
//		$date['btime'] = time();
//		$date['balance_sn'] = $order_id;
//		$date['pay_type'] = 'qtbzfbpay';
//		$date['remarks'] = _lang('支付宝充值');
//		db('balance')->insertGetId($date);
//		$url = "parter=". $merchant_id ."&type=". $bankType ."&value=". $amount . "&orderid=". $order_id ."&callbackurl=". $bank_callback_url;
//		//签名
//		$sign	= md5($url. $merchant_key);
//
//		//最终url
//		$url	= 'http://gateway.qpabc.com/bank/' . "?" . $url . "&sign=" .$sign. "&hrefbackurl=". $bank_hrefbackurl;
//
//		//页面跳转
//		header("location:" .$url);
//	}


    public function user_tixian()
    {
        $uid = $this->uid;;
        $user = Db::name('userinfo')->where('uid',$uid)->find();

        //出金------------------------------------------
        //已签约信息
        $data['mybank'] = db('bankcard')->where('uid',$uid)->find();
        $data['myusdt'] = db('usdt')->where('uid',$uid)->find();
        //资金流水
        $data['order_list'] = db('price_log')->where('uid',$uid)->order('id desc')->limit(0,20)->select();

        //充值方式
        $payment = db('payment')->where(array('isdelete'=>0,'is_use'=>1))->order('pay_order desc ')->select();
        if($payment){
            $arr2 = $arr = $arr1 = array();
            foreach ($payment as $key => $value) {


                $arr1 = explode('|',trimall($value['pay_conf']));

                foreach ($arr1 as $k => $v) {
                    $arr2 = explode(':',trimall($v));
                    if(isset($arr2[0]) && isset($arr2[1])){
                        $arr[$arr2[0]] = $arr2[1];
                    }


                }
                $payment[$key]['pay_conf_arr'] = $arr;


            }
        }

        //推广二维码
        if($user['otype'] == 101){
            $oid = $uid;
        }else{
            $oid = $user['oid'] ;
        }
        $data['oid_url'] = "http://".$_SERVER['SERVER_NAME'].'?fid='.$oid;

        //dump($payment);exit;
//        $data['sub_bankno'] = substr($data['mybank']['accntno'],-4,4);
        $data['sub_bankno'] = $data['mybank']['accntno'];
        $data['sub_host'] = substr($data['myusdt']['host'],-4,4);
        //入金金额
        $reg_push = $this->conf['reg_push'];
        if($reg_push){
            $reg_push = explode('|',$reg_push);
        }
        $this->assign($data);
        $this->assign('payment',$payment);
        $this->assign('reg_push',$reg_push);
        return $this->fetch();
	}


    public function user_add_bank()
    {
        $uid = $this->uid;;
        $user = Db::name('userinfo')->where('uid',$uid)->find();

        //出金------------------------------------------
        //银行卡
        $data['banks'] = db('banks')->select();

        //地区
        $province = db('area')->where(array('pid'=>0))->select();

        //已签约信息
        $data['mybank'] = db('bankcard')->alias('b')->field('b.*,ba.bank_nm')
            ->join('__BANKS__ ba','ba.id=b.bankno')
            ->where('uid',$uid)->find();


        //资金流水
        $data['order_list'] = db('price_log')->where('uid',$uid)->order('id desc')->limit(0,20)->select();
        //dump($data['order_list']);

        //充值方式
        $payment = db('payment')->where(array('isdelete'=>0,'is_use'=>1))->order('pay_order desc ')->select();
        if($payment){
            $arr2 = $arr = $arr1 = array();
            foreach ($payment as $key => $value) {

                $arr1 = explode('|',trimall($value['pay_conf']));

                foreach ($arr1 as $k => $v) {
                    $arr2 = explode(':',trimall($v));
                    if(isset($arr2[0]) && isset($arr2[1])){
                        $arr[$arr2[0]] = $arr2[1];
                    }
                }
                $payment[$key]['pay_conf_arr'] = $arr;


            }
        }

        //推广二维码
        if($user['otype'] == 101){
            $oid = $uid;
        }else{
            $oid = $user['oid'] ;
        }
        $data['oid_url'] = "http://".$_SERVER['SERVER_NAME'].'?fid='.$oid;

        //dump($payment);exit;
        $data['sub_bankno'] = substr($data['mybank']['accntno'],-4,4);
        //入金金额
        $reg_push = $this->conf['reg_push'];
        if($reg_push){
            $reg_push = explode('|',$reg_push);
        }

        $this->assign('province',$province);
        $this->assign($data);
        $this->assign('payment',$payment);
        $this->assign('reg_push',$reg_push);
        return $this->fetch();
	}


    public function user_add_usdt()
    {
        return $this->fetch();
	}

    public function add_usdt()
    {
        $post = input('post.');

        foreach ($post as $k => $v) {

            if(empty($v)){
                return WPreturn(_lang('请正确填写信息！'),-1);
            }

            $post[$k] = trim($v);

        }
        if(isset($post['id']) && !empty($post['id'])){

            $ids = db('bankcard')->update($post);
        }else{
            unset($post['id']);
            $post['uid'] = $this->uid;
            $ids = db('usdt')->insert($post);
        }

        if ($ids) {
            return WPreturn(_lang('操作成功!'),1);
        }else{
            return WPreturn(_lang('操作失败,请重试!'),-1);
        }
	}


    public function chongzhi_select()
    {
        return $this->fetch();
	}

    public function congzhi_usdt()
    {
        return $this->fetch();
	}


    public function recharge_usdt()
    {
        if(input('post.')){
            $data = input('post.');
            $uid = $this->uid;
            $userinfo = Db::name('userinfo')->field('uid,username,usermoney')->where('uid',$uid)->find();
            //签约信息
            $mybank = db('bankcard')->where('uid',$uid)->find();
            $insert = [
                'bptype' => 3,
                'bptime' => time(),
                'bpprice' => $data['accntnm'],
                'remarks' => _lang('会员充值'),
                'uid' => $uid,
                'btime' => time(),
                'bankid' => $mybank['id'],
                'isverified' => 0,
                'bpbalance' => $userinfo['usermoney'],
                'holder' => $data['holder'],
                'host' =>$data['host'],
                'intel' => $data['intel'],
                'comment' => $data['comment'],
                'type' => 2 //USDT充值
            ];
            $bpid = Db::name('balance')->insertGetId($insert);
            if ($bpid) {
                return WPreturn(_lang('充值申请提交成功！'),1);
            }
            return WPreturn(_lang('提现申请提交失败！'),1);
        }else{
            $uid = $this->uid;;
            $user = Db::name('userinfo')->field('usermoney')->where('uid',$uid)->find();
            $this->assign($user);
            return $this->fetch();
        }
	}
}

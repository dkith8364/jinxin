<?php
namespace app\admin\controller;
use think\Controller;
use think\Db;
use think\Cookie;
class Base extends Controller
{
    public function __construct(){
		parent::__construct();
		
		
		//session_unset();
		//验证登录
		$login = cookie('denglu');
		if(!isset($login['userid'])){
			$this->error('请先登录！','login/login',1,1);
		}
		
		if(!isset($login['token']) || $login['token'] != md5('zuogehaorenba')){
			$this->redirect('login/logout');
		}

		$request = \think\Request::instance();
		
		$contrname = $request->controller();
        $actionname = $request->action();
        
        $this->assign('contrname',$contrname);
        $this->assign('actionname',$actionname);

		$switchOrder = Cookie::get('switchOrder');
		$switchCash = Cookie::get('switchCash');

		$this->assign('switchOrder',$switchOrder);
		$this->assign('switchCash',$switchCash);

        $this->otype = $login['otype'];
        $this->uid = $login['userid'];

        $this->assign('otype',$this->otype);
	}

	protected function fetch($template = '', $vars = [], $replace = [], $config = [])
    {
    	$replace['__ADMIN__'] = str_replace('/index.php','',\think\Request::instance()->root()).'/static/admin';
        return $this->view->fetch($template, $vars, $replace, $config);
    }
}

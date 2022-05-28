<?php
namespace app\index\behavior;
use think\Db;
use think\Cache;

class Online 
{
    public function run(&$params)
    {
        // 更新在线时间点
        if(isset($_SESSION['uid']) && !Cache::get('online_uid_'.$_SESSION['uid'])){
            Cache::set('online_uid_'.$_SESSION['uid'],1,300);
            if(Db::name('online')->where(['uid'=>$_SESSION['uid']])->find()){
                Db::name('online')->where(['uid'=>$_SESSION['uid']])->update(['up_time'=>date('Y-m-d H:i:s')]);
            }else{
                Db::name('online')->insert(['uid'=>$_SESSION['uid'],'up_time'=>date('Y-m-d H:i:s')]);
            }
        }
    }
}
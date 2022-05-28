<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------
if(isset($_FILES['file'])){
    return null;
}
foreach ($_GET as $k=>$v){
    if(is_string($v) && strlen($v)>255){
         return null;
    }
    $_GET[$k] = addslashes($v);
}
foreach ($_POST as $k=>$v){
    if(is_string($v) && strlen($v)>1000){
         return null;
    }
    if(is_string($v)) $_POST[$k] = addslashes($v);
}

// foreach ($_POST as $k=>$v){
//     if(is_string($v) && strlen($v)>300){
//          return null;
//     }    
// }
// [ 应用入口文件 ]
header("Content-type: text/html; charset=utf-8"); 
//开启session
session_start();
// 定义应用目录
define('APP_PATH', __DIR__ . '/application/');
// 加载框架引导文件
require __DIR__ . '/thinkphp/start.php';



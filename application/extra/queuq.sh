#!/bin/bash
step=5
for ((i = 0; i < 60; i=(i+$step))); do
cd /www/wwwroot/chongxiewaihui
url="index/api/getdate"  # flash_product
php index.php $url
url2="index/api/order" # flash_order
php index.php $url2
url3="index/api/allotorder" # 订单对冲
php index.php $url3
url4="index/api/checkbal" # 新加坡28结算
php index.php $url4
sleep $step
done
exit 0
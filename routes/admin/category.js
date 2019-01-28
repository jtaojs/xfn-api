/**
 * 菜品类别相关的路由
 */
const express=require('express')
const pool=require('../../pool')
//创建一个空路由
var router=express.Router();


/** 
 * api:    GET /admin/categorry
 * 含义:客户端获取所有的菜品类别,按编号升序排列
 * 返回值形如:[{cid:1,cname:'...'}]
 */



 /** 
 * API:    DELETE /admin/categorry
 * 含义:客户端获取所有的菜品类别,按编号升序排列
 * 返回值形如:[{cid:1,cname:'...'}]
 */



//到处路由
module.exports=router;
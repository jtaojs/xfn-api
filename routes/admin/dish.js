/**菜品相关路由 */
const express = require('express');
const pool = require('../../pool');
var router = express.Router();
module.exports = router;
/**
 * API：  GET  /admin/dish
 * 获取所有的菜品（按类别进行分类）
 * 返回数据：
 * [
 * {cid:1,cname:"肉类",dishList:[{},{},...]}
 * {cid:2,cname:"菜类",dishList:[{},{},...]}
 * ...
 * ]
 */
router.get('/',(req, res) => {
  // 为了获取所有菜品,必须先查询所有的菜品类别
  pool.query('SELECT cid,cname FROM xfn_category ORDER BY cid',(err,result) => {
    if (err) throw err
    //res.send(result)
    var categoryList=result;//菜品类别
    var count=0;//已经产讯玩的菜品的类别的数量
    for(let c of categoryList){
      pool.query('SELECT * FROM xfn_dish WHERE categoryId=? ORDER BY did DESC',c.cid,(err,result)=>{
        if(err) throw err 
        c.dishList=result;
        //必须保证所有的类别下的菜品都查询完成才能发送像一个消息--这些查询都是异步的(不知道谁先完成)
        count++;
        if(count==categoryList.length){
          res.send(categoryList)
        }
      })
    }
  })
})
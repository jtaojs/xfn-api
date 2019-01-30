const express=require('express')
const pool=require('../../pool')
//创建一个空路由
var router=express.Router();
module.exports=router;

/**
 * API:  GET /admin/settings  获取全局设置
 * 返回数据:[{...}]
 */
router.get('/',(req,res)=>{
    pool.query('SELECT * FROM xfn_settings LIMIT 1',(err,result)=>{
        if(err) throw err
            res.send(result[0])
    })
})
 /**
  * API: PUT /admin/settings  修改全局设置
  * 请求参数:{...}JSON对象
  * 返回数据:{code:200,msg:"1 settings modified"}
  * {code:400,msg:"0 settings modified not exiets"}
  * {code:401,msg:"1 settings modified no modifition"}
  */
 router.put('/',(req,res)=>{
     var data=req.body;
     pool.query('UPDATE xfn_settings SET ?',[data],(err,result)=>{
         if(err)throw err;
         if(result.changedRows>0){
             res.send({code:200,msg:"1 settings modified"})
         }else if(result.affectedRows==0){
            res.send({code:400,msg:"0 settings modified not exiets"})
         }else if(result.affectedRows==1&&result.changedRows==0){
             res.send({code:401,msg:"1 settings modified no modifition"})
         }
     })
 })
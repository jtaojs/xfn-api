const express=require('express')
const pool=require('../../pool')
//创建一个空路由
var router=express.Router();
module.exports=router;

/**
 * API:  GET /admin/table  获取所有桌台信息
 * 返回数据[{}]
 */
router.get('/',(req,res)=>{
    pool.query('SELECT * FROM xfn_table ORDER BY tid',(err,result)=>{
        if(err){throw err}
        res.send(result)
    })
})

 /**
  * API:  GET /admin/table/reservation/:tid  获取预约的状态桌台的详情
  */
 router.get('/reservation/:tid',(req,res)=>{
     var tid=req.params.tid;
     pool.query('SELECT status FROM xfn_table WHERE tid=?',tid,(err,result)=>{
         if(err)throw err;
         if(result[0].status==2){
             pool.query('SELECT * FROM xfn_reservation WHERE tableId=?',tid,(err,result)=>{
                 if(err){throw err}
                 res.send(result)
             })
         }
     })
 })

  /**
   * API:  GET /admin/table/inuse/tid 获取占用的桌台的信息
   */
  router.get('/inuse/:tid',(req,res)=>{
    var tid=req.params.tid;
    pool.query('SELECT status FROM xfn_table WHERE tid=?',tid,(err,result)=>{
        if(err)throw err;
        if(result[0].status==3){
            pool.query('SELECT * FROM xfn_reservation WHERE tableId=?',tid,(err,result)=>{
                if(err){throw err}
                res.send(result)
            })
        }
    })
})

   /**
    * API: PATCH  /admin/table  修改桌台的状态
    * 请求参数:{..}
    * 返回数据
    */
router.patch('/',(req,res)=>{
    var data=req.body;
    pool.query('UPDATE xfn_table SET ? WHERE tid=?',[data,data.tid],(err,result)=>{
        if(err)throw err;
         if(result.changedRows>0){
             res.send({code:200,msg:"1 tableStatus modified"})
         }else if(result.affectedRows==0){
            res.send({code:400,msg:"0 tableStatus modified not exiets"})
         }else if(result.affectedRows==1&&result.changedRows==0){
             res.send({code:401,msg:"1 tableStatus modified no modifition"})
         }
    })
})
    /**
     * API:POST /admin/table  添加桌台
     */
    router.post('/',(req,res)=>{
        console.log(req.body)
        var data=req.body;
        pool.query('INSERT INTO xfn_table SET ?',data,(err,result)=>{
          if(err)throw err
          if(result.affectedRows>0){
            res.send({code:200,msg:'table added succ',tableId:result.insertId})//将insert语句产生的自增编号输出给客户端
          }
        })
      })
      
     /**
     * API:DELETE /admin/table  删除桌台
     */
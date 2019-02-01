/**
 * 菜品类别相关的路由
 */
const express = require('express')
const pool = require('../../pool')
//创建一个空路由
var router = express.Router();
//导出路由
module.exports = router;


/** 
 * api:    GET /admin/categorry
 * 含义:客户端获取所有的菜品类别,按编号升序排列
 * 返回值形如:[{cid:1,cname:'...'}]
 */
router.get('/', (req, res) => {
    pool.query('SELECT * FROM xfn_category ORDER BY cid', (err, result) => {
        if (err) {
            throw err;
        }
        res.send(result)
    })
})


/** 
* API:    DELETE /admin/categorry/:cid
* 含义:根据表示菜品编号的路由参数,删除该菜品
* 返回值形如:{code:200,msg:'1 category deleted'},{code:400,msg:'0 category deleted'}
*/
router.delete('/:cid', (req, res) => {
    //注意:删除菜品类别前必须把属于该类别的菜品编号设置为null
    pool.query('UPDATE xfn_dish SET categoryId=NULL WHERE categoryId=?', req.params.cid, (err, result) => {
        if (err) throw err;
        //致此,指定菜品类别的菜品已经修改完毕
        pool.query('DELETE FROM xfn_category WHERE cid=?',req.params.cid,(err,result)=>{
            if(err) throw err;
            if(result.affectedRows>0){
                res.send({code:200,msg:'1 category deleted'})
            }else{
                res.send({code:400,msg:'0 category deleted'})
            }
        })
    })
})
/** 
 * API:    POST /admin/categorry
 * 请求参数:{cname:'xxx'}
 * APPLICATION/JSON
 * 含义:添加新的菜品类别
 * 返回值形如:{code:200,msg:'1 category added',cid:xxx},
 */
router.post('/', (req, res) => {
    var data=req.body;//形如{cname:'xxx'}
    pool.query('INSERT INTO xfn_category SET ?',data,(err,result)=>{//注意此处sql语句的简写
        if(err){throw err}
        res.send({code:200,msg:'1 category added',cid:result.insertId})
    })
})


/** 
 * API:    PUT /admin/categorry   PATCH(部分修改)
 * 请求参数:{cid:xx,cname:'xxx'}->json
 * 含义:根据菜品类别编号,修改该类别
 * 返回值形如:{code:200,msg:'1 category updated'},
 * {code:400,msg:'0 category updated,not exists'},
 * {code:401,msg:'0 category updated ,no modifition'},
 */
router.put('/', (req, res) => {
    //console.log(req.body)
    var data=req.body;    //请求参数:{cid:xx,cname:'xxx'}
    //此处可以对数据进行验证
    pool.query('UPDATE xfn_category SET ? WHERE cid=?',[data,data.cid],(err,result)=>{
        if(err){throw err}
        if(result.changedRows>0){//实际更新了一行
            res.send({code:200,msg:'1 category modified'})
        }else if(result.affectedRows==0){
            res.send({code:400,msg:'0 category modified,not exists'})
            //影响到一行但更新了0行,新旧值一直
        }else if(result.affectedRows==1&&result.changedRows==0){
            res.send({code:401,msg:'0 category modified ,no modifition'})
        }
    })

})

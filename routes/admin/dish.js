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
/**
 * API：  POST  /admin/dish/image
 * 接受客户端上传的菜品图片,保存在服务器上,返回该图片在服务器上的随机文件名
 * 请求参数:
 * 返回数据:{code:200,msg:'upload suss',fileName:newFileName}
 */
const multer=require('multer')
const fs=require('fs')
var upload=multer({dest:'tmp/'})//指定客户端上传的文件临时存储路径
router.post('/image',upload.single('dishImg'),(req,res)=>{
  //console.log(req.file)//客户端上传的图片文件信息
  //console.log(req.body)//客户端随同图片提交的字符数据
  //把客户端上传的文件从临时目录转移到永久的图片路径下
  var tmpFile=req.file.path;//临时文件路径
  var suffix=req.file.originalname.substring(req.file.originalname.lastIndexOf('.'))//原始文件名中的后缀部分
  var newFileName=randFileName(suffix)//随机文件名
  fs.rename(tmpFile,"img/dish/"+newFileName,()=>{
    res.send({code:200,msg:'upload suc',fileName:newFileName})
  })
})

//suffix表示生成的文件名的后缀
function randFileName(suffix){
  var time=new Date().getTime();//当前系统时间
  var num=Math.floor(Math.random()*(10000-1000)+1000)//4位的随机数
  return time+'-'+num + suffix
}
//max  min  Math.random()*(max-min)+min


 /**
 * API：  POST  /admin/dish
 * 请求参数:{title:'xxx',imgUrl:"xxxx",price:xx,detail:'xx',categoryId:xx}
 * 添加一个新的菜品
 * 输出消息:{code:200,msg:'dish added succ',dishedId:xx}
 * 
 */
router.post('/',(req,res)=>{
  console.log(req.body)
  var data=req.body;
  pool.query('INSERT INTO xfn_dish SET ?',data,(err,result)=>{
    if(err)throw err
    if(result.affectedRows>0){
      res.send({code:200,msg:'dish added succ',dishedId:result.insertId})//将insert语句产生的自增编号输出给客户端
    }
  })
})

 /**
 * API：  DELETE  /admin/dish
 * 根据指定的菜品编号删除该菜品
 * 输出消息:{code:200,msg:'dish added succ',dishedId:xx}
 * 返回数据:{code:200,msg:'dish deleted succ'}
 */
router.delete('/:did',(req,res)=>{
  var did=req.params.did;
  //先查询其外键约束,将其设置为NULL;dishId
  pool.query('UPDATE xfn_order_detail SET dishId=NULL WHERE dishId=?',did,(err,result)=>{
    if(err)throw err
    pool.query('DELETE FROM xfn_dish WHERE did=?',did,(err,result)=>{
      if(err) throw err;
      if(result.affectedRows>0){
        res.send({code:200,msg:'1 dish deleted'})
      }else{
        res.send({code:400,msg:'0 dish deleted'})
      }
    })
  })
})
/**
 * API: PUT /admin/dish
 * 请求参数:{title:'xxx',price:xx}
 * 根据菜品编号修改菜品信息
 * 返回数据{code:200,msg:'1 dish modified succ'}
 * {code:400,msg:'0 dish modified,not exists'}编号不存在
 * {code:401,msg:'0 dish modified ,no modifition'}两次相同
 */
router.put('/',(req,res)=>{
  var data=req.body;
  pool.query('UPDATE xfn_dish SET ? WHERE did=?',[data,data.did],(err,result)=>{
    if(err)throw err;
    if(result.changedRows>0){
      res.send({code:200,msg:'1 dish modified succ'})
    }else if(result.affectedRows==0){
      res.send({code:400,msg:'0 dish modified,not exists'})
    }else if(result.affectedRows==1&&result.changedRows==0){
      res.send({code:401,msg:'0 dish modified ,no modifition'})
  }
  })
})

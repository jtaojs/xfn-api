const express=require('express')
const pool=require('../../pool')
//创建一个空路由
var router=express.Router();
//导出路由
module.exports=router;
/**
 * API: GET /admin/login
 * ????get 请求可以有主体吗?不能
 * /admin/login/:aname/:apwd
 * 完成用户登录验证(有的项目中此处选择post方法)
 * 返回数据:{code:200,msg:'login success'}
 * {code:400,msg:'login failed'}
 */
router.get('/login/:aname/:apwd',(req,res)=>{
    var aname=req.params.aname;
    var apwd=req.params.apwd;
    //需要对用户输入的密码执行加密函数
    pool.query('SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)',[aname,apwd],(err,result)=>{
        if(err){throw err}
        console.log(result)
        if(result.length>0){//查询到一行数据,登陆成功
            res.send({code:200,msg:'login success'})
        }else{//没用查询到数据,登录失败
            res.send({code:400,msg:'login failed'})
        }
    });
})

 /**
 * API: PATCH /admin
 * 请求参数:{aname:'xxx',newpwd:'123456',oldpwd:'1234567890'}
 * 根据管理员名和密码修改管理员密码
 * 返回数据:{code:200,msg:'modified success'}
 * {code:400,msg:'aname or apwd err'}
 * {code:401,msg:'apwd not modified'}
 */
router.patch('/',(req,res)=>{
    var data=req.body;
    //console.log(data)
    //首先根据aname和oldPwd查询该用户是否存在{aname:'admin',oldPwd:'123456',newPwd:'666666'}
    pool.query('SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)',[data.aname,data.oldPwd],(err,result)=>{
        if(err){throw err}
        if(result.length==0){
            res.send({code:400,msg:'aname or apwd err'})
            return
        }
       ////如果存在,在修改密码
       pool.query('UPDATE xfn_admin SET apwd=PASSWORD(?) WHERE aname =?',[data.newPwd,data.aname],(err,result)=>{
           if(err) {throw err}
           if(result.changedRows>0){//密码修改完成
               res.send({code:200,msg:'modified success'})
           }else{//新旧密码一致,未作修改
               res.send({code:401,msg:'apwd not modified'})
           }
       })
    })
})
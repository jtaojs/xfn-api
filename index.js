/**
 * 小肥牛的点餐系统api子系统
 * 
 */
//导入路由器
const categoryRouter=require('./routes/admin/category')
const adminRouter=require('./routes/admin/admin')
const dishRouter=require('./routes/admin/dish')
const settingsRouter=require('./routes/admin/settings')
const tableRouter=require('./routes/admin/table')
//console.log('准备启动API服务器')
//console.log(new Date().toLocaleDateString())
//const port=8090;
const port=5050;
const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
//启动主服务器
var app=express()
app.listen(port,()=>{    
    console.log("服务正在监听"+port)
})
//bodyparser文件配置
app.use(bodyParser.json())//吧json格式的请求主体解析出来放入req.body属性
//使用跨域中间件
app.use(cors());
     app.get('/test',(req,res)=>{
         res.send({code:200,msg:'test succ'})
     })
//挂载路由器
app.use('/admin/category',categoryRouter)
app.use('/admin',adminRouter)
app.use('/admin/dish',dishRouter)
app.use('/admin/settings',settingsRouter)
app.use('/admin/table',tableRouter)
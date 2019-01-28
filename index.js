/**
 * 小肥牛的点餐系统api子系统
 * 
 */
const port=8090;
const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
//启动主服务器
var app=express()
app.listen(port,()=>{
    console.log("服务正在监听"+port)
})
app.use(bodyParser.urlencoded({
    extended:false
}))
app.use(cors(
    res.header('Access-Control-Allow-Origin', '*')
))
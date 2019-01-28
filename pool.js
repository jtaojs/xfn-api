//创建MySQL连接
const mysql=require('mysql');
var pool=mysql.createPool({
  host: '127.0.0.1',  //数据库地址
  port: '3306',       //数据库端口
  user: 'root',       //数据库管理员
  password: '',       //数据库密码
  database: 'xfn',     //数据库名称
  connectionLimit: 15   //链接池中链接数量
});
//将来要被其它的模块使用
module.exports=pool;
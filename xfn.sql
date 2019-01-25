#设置客户端语言
SET NAMES UTF8;
#放弃数据库(如果存在)xfn
DROP DATABASE IF EXISTS xfn;
#创建数据库tedu
CREATE DATABASE xfn CHARSET=UTF8;
#进入数据库
USE xfn;
#创建管理员信息表
CREATE TABLE xfn_admin(
    aid INT PRIMARY KEY AUTO_INCREMENT, #管理员编号
    aname VARCHAR(32) UNIQUE,           #管理员用户名
    apwd VARCHAR(64)                    #管理员密码
);
INSERT INTO xfn_admin VALUES(NULL,'taojin','md5(123456');

#创建设置表
CREATE TABLE xfn_settings(
    sid INT PRIMARY KEY AUTO_INCREMENT, #编号
    appName  VARCHAR(32),               #应用/店家名称
    apiUrl VARCHAR(64),                 #数据API子系统地址
    AdminUrl VARCHAR(64),               #管理后台子系统地址
    appUrl VARCHAR(64),                 #顾客App子系统地址
    icp VARCHAR(64),                    #系统备案号
    copyright VARCHAR(128)              #系统版权声明
);
INSERT INTO xfn_settings VALUES(NULL,'牛魔王','http://127.0.0.1:8090','http://127.0.0.1:8091','http://127.0.0.1:8092','sjsakfhsakfhsakfjhsakjlfsaklh','safhsajfhsajasdjsadhsajda');


#创建餐桌信息表
CREATE TABLE xfn_table(
    tid INT PRIMARY KEY AUTO_INCREMENT,#餐桌编号
    tname VARCHAR(64),                  #桌台昵称  
    type VARCHAR(16),                   #桌台类型，如3-4人桌
    status INT                          #当前状态
);
INSERT INTO xfn_table VALUES(NULL,'物华天宝',8,0);
INSERT INTO xfn_table VALUES(NULL,'人杰地灵',2,1);
INSERT INTO xfn_table VALUES(NULL,'瑶池',4,2);
INSERT INTO xfn_table VALUES(NULL,'地宫',8,3);
INSERT INTO xfn_table VALUES(NULL,'暗影岛',8,0);
INSERT INTO xfn_table VALUES(NULL,'钢铁烈阳',2,1);
INSERT INTO xfn_table VALUES(NULL,'影流',4,2);
INSERT INTO xfn_table VALUES(NULL,'艾欧尼亚',8,3);

#创建桌台预定信息表
CREATE TABLE xfn_reservation(
    rid	INT PRIMARY KEY AUTO_INCREMENT, #信息编号
    contactName	VARCHAR(64),            #联系人姓名
    phone	VARCHAR(16),                #联系电话
    contactTime	BIGINT,                 #联系时间
    dinnerTime	BIGINT                  #预约的用餐时间
);
INSERT INTO xfn_reservation VALUES(NULL,'李文华','13854621256',now(),now());

#创建菜品分类表
CREATE TABLE xfn_category(
    cid	INT PRIMARY KEY AUTO_INCREMENT,#类别编号
    cname	VARCHAR(32)                #类别名称
);
INSERT INTO xfn_category VALUES(10,'肉类');
INSERT INTO xfn_category VALUES(20,'蔬菜');
INSERT INTO xfn_category VALUES(30,'河鲜海鲜');
INSERT INTO xfn_category VALUES(40,'菌类');

#创建菜品信息表：xfn_dish
CREATE TABLE xfn_dish(
    did	INT PRIMARY KEY AUTO_INCREMENT, #菜品编号，起始值为100000
    title	VARCHAR(32),                #菜品名称/标题
    imgUrl	VARCHAR(128),               #图片地址
    price	DECIMAL(6,2),               #价格
    detail	VARCHAR(128),               #详细描述信息
    categoryId	INT, 
    FOREIGN KEY (categoryId) REFERENCES xfn_category (cid) #所属类别的编号
);
INSERT INTO xfn_dish VALUES(100000,'虾滑',"http://127.0.0.1:8090",99.99,"的撒监督法核算会计哈萨克加萨科技的",30);

#创建订单表xfn_order 
CREATE TABLE xfn_order VALUE(
    oid INT PRIMARY KEY AUTO_INCREMENT, #订单编号
    startTime BIGINT,                   #开始时间
    endTime BIGINT,                     #结束时间
    customerCount INT,                  #用餐人数
    tableId INT,                        #餐桌编号
    FOREIGN KEY (tableId) REFERENCES xfn_table (tid)
)
#创建订单详情表xfn_order_detail
CREATE TABLE xfn_order_detail VALUE(
   did INT PRIMARY KEY AUTO_INCREMENT,#订单编号
   dishId INT,#菜品标号
   FOREIGN KEY (dishId) REFERENCES xfn_dish (did),
   dishCount INT,#菜品数量
   customerName VARCHAR(64),#顾客名称
   orderId INT,#订单编号
   FOREIGN KEY (orderId) REFERENCES xfn_order (oid)
)






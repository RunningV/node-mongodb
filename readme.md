node+mongodb建站学习
依赖nodejs服务+mongodb+express数据库

操作：
1、首先电脑要安装node+mongodb，并开启mongdb数据库
  手动开启mongodb数据库方式：
  进入到mongodb/bin目录，打开命令行：
  mongod --dbpath '../mongodb/db'
  上面路径写mongodb安装的绝对路径，会在mongodb目录下
  新建db文件夹保存运行中的数据
2、在此项目根目录下运行：
    npm install
    node app.js

这样就开启了此项目的node服务
在浏览器打开localhost:3000进入首页
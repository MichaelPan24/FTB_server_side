const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const {connect} = require('../config/db');
const projectRouter = require('../routers/project');
const workRouter = require('../routers/work');

const port = process.env.PORT || 3301;

const  app = express();

//解析请求主体
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//使用express-session中间件,传递session供用户登陆验证使用
app.use(session({
    secret: 'bnjj1314zyq',
    resave: false,
    cookie:{
        maxAge: 20*60*1000
    }
}))

//解析路由
app.use('/api/project/', projectRouter);
// app.use('/api/show/', workRouter);

app.get('/', (req, res) => {
    res.send('hello ')
})
//连接数据库
connect()


app.listen(port, () => {
    console.log('server running ')
})
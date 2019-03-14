const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const {connect} = require('../config/db');
const projectRouter = require('../routers/project');
const userRouter = require('../routers/user');

const port = process.env.PORT || 3301;

const  app = express();

//解析请求主体
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req, res, next){
    //设置跨域访问
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200); /*让options请求快速返回*/
    }else {
        next();
    }
})
//使用express-session中间件,传递session供用户登陆验证使用
app.use(session({
    secret: 'bnjj1314zyq',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 20*60*1000
    }
}))

//解析路由
app.use('/api/project/', projectRouter);
app.use('/api/user/', userRouter );

app.get('/', (req, res) => {
    res.redirect('/api/project/current')
})
//连接数据库
connect()


app.listen(port, () => {
    console.log('server running ')
})
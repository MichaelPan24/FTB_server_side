const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const redis = require('redis');

let redisStore = require('connect-redis')(session);
let redisClient  = redis.createClient('6379', '127.0.0.1');

const {connect} = require('./config/db');
const projectRouter = require('./routers/project');
const userRouter = require('./routers/user');
const workRouter = require('./routers/work')
// const workRouter = require('./routers/work');

const port = process.env.PORT || 3301;

const  app = express();

//解析请求主体
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//redis 链接错误
redisClient.on("error", function(error) {
    console.log(error);
});

//托管静态资源文件
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
    // console.log(req.headers)
    //设置跨域访问
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', true)

    if (req.method == 'OPTIONS') {
        res.send(200); /*让options请求快速返回*/
    }else {
        next();
    }
})
//使用express-session中间件,传递session供用户登陆验证使用
app.use(session({
    store: new redisStore({client: redisClient}),
    secret: 'bnjj1314zyq',
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 20*60*1000
    }
}))

//解析路由
// app.use('/api/work/', workRouter );
app.use('/api/project/', projectRouter);
app.use('/api/user/', userRouter );
app.use('/api/show/', workRouter);

app.get('/', (req, res) => {
    res.redirect('/api/project/current')
})
//连接数据库
connect()


app.listen(port, () => {
    console.log('server running ')
})
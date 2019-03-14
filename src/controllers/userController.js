const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//注册处理
exports.register = function(req, res, next){
    const UserInfo = req.body;
    User.findOne({
        email: UserInfo.email
    }).then(user => {
        if(user) {
            return res.status(400).json('邮箱已被注册');
        } else {
            const avatar = gravatar.url(UserInfo.email, {s: '200', r: 'pg', d: 'py'});
            const newUser = new User({
                name: UserInfo.name,
                email: UserInfo.email,
                password: UserInfo.password,
                identify: UserInfo.identify,
                avatar: avatar
            });
            //用bcrypt对密码进行加密
            bcrypt.hash(newUser.password, 10, (hash) => {
                if(hash) {
                    newUser.password = hash;
                    //存储新用户
                    newUser.save()
                        .then(user => {
                            res.json('注册成功')
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }else{
                    console.log(err);
                }
            })
        } 
    })
}

//登陆处理
exports.logIn = function(req, res, next){
    const userInfo = req.body;
    User.findOne({
        email: userInfo.email
    }).then(user => {
        if(!user){
            res.status(400).json('用户不存在')
        }
        //验证成功
        bcrypt.compare(userInfo.password, user.password , (err, isMatched) => {
            if(err) throw err;
            if(isMatched){
                //对登陆进行加密,设置新规则,并返回token
                const rule = {
                    id: user.id,
                    name: user.name,
                    identify: user.identify,
                    avatar: user.avatar
                }
                jwt.sign(rule, 'secret', (err, token) => {
                    if(err){
                        throw err
                    }
                    //报错用户登录信息,作为认证
                    req.session.loginUser = user;
                    res.json({
                        success: true,
                        token: 'Bearer' + token
                    })
                })
            }else{
                res.status(400).json('密码错误')
            }
        })
    })
}

exports.logOut = function(req, res ,next){
    req.session.destroy( (err) => {
        if(err){
            res.json('出现错误, 请重试');
        }
        req.session.loginUser = null;
    })
    res.redirect('/');
}
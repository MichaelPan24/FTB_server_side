const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const fs = require('fs');

const User = require('../models/user');
const Project = require('../models/project');
const Work = require('../models/work');

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
                _id: new mongoose.Types.ObjectId(),
                name: UserInfo.name,
                email: UserInfo.email,
                password: UserInfo.password,
                identify: UserInfo.identify,
                avatar: avatar
            });
            //用bcrypt对密码进行加密
            bcrypt.hash(newUser.password, 10, (err, hash) => {
                if(hash) {
                    newUser.password = hash;
                    //存储新用户
                    newUser.save()
                        .then(user => {
                            if(user){
                                res.status(200).json(user)
                            }
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

/**
 * 登陆处理
 */
exports.logIn = function(req, res, next){
    const userInfo = req.body;
    User.findOne({
        email: userInfo.email
    }).then(user => {
        if(!user){
            res.status(404).json('用户不存在');
            return;
        }else if(user && !bcrypt.compare(userInfo.password, user.password)){
            res.status(400).json('您输入的密码有误');
            return;
        }else {
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
                    //保存用户登录信息,生成token,作为认证
                    
                    // req.session.regenerate(err => {
                    //     if(err) throw err;
                        req.session.cookie.token = 'Bearer '+token;
                        req.session.loginUser = user;
                    // })
                        
                    res.status(200).json({
                        success: true,
                        token: 'Bearer ' + token,
                        user: user
                    })
                })
            }else{
                res.status(400).json('密码错误')
            }
        })}
    })
}

// handleError: function handleError(){}
/**
 * 登出
 */
exports.logOut = function(req, res ,next){
    if(req.session){
        req.session.destroy( (err) => {
            if(err){
                res.json('出现错误, 请重试');
            }
            res.status(200).json('已登出');
            // req.session.loginUser = null;
        })
    }
}

//更新用户的基本个人信息
exports.updateInfo = function(req, res, next){
    const context = this;
    if(checkIsLogin(req.session)){
        const userId = req.params.userId;
        const {name, email, password} = req.body;
        const avatarData = req.file ? req.file : null; 

        find: User.findById(userId, async(err, user) => {
            if(err) return err;
            name && user.set({name: name});
            email && await User.findOne({email: email}).then(User => {
                if(!User) {return user.set({email: email});}
                else{res.status(403).end('邮箱已存在'); return updateInfo }
            })

            password && user.set({password: bcrypt.hashSync(password, 10)});

            avatarData && await fs.rename(avatarData.path, __dirname+ '/../public/upload/avatars/' + avatarData.originalname, (err) => {
                if(err){
                    throw err;
                }
                console.log('updated user avatar')
            }) 
            user.set({avatar: 'http://192.168.1.103:3301/upload/avatars/'+ avatarData.originalname})

            user.save((err, updatedUser) => {
                if(err) throw err;
                res.status(200).send(updatedUser)
            })
        })

    }else{
        res.status(403).send('未登录');
    }
}

/**
 * 更新用户的收藏夹
 */
exports.updateFav = function(req, res, next){
    if(checkIsLogin(req.session)){
        const userId = req.params.userId;
        const favProject = req.body.favProject;
        const favWork = req.body.favWork;
        User.findById(userId).populate('works').populate('projects').exec((err, user) => {
            if(err) return err;
            favProject && user.favorites_project.push(favProject) && User.findById(userId).populate('projects').exec((err, user) => {
                user.favorites_project.connectedUser.push(user._id);
                user.favorites_project.save();
            });
            favWork && user.favorites_work.push(favWork) && User.findById(userId).populate('works').exec((err, user) => {
                user.favorites_work.collectedUser.push(user._id);
                user.favorites_work.save();
            });
            user.save((err, updatedUser) => {
                if(err) return err;
                res.send(updatedUser);
            })
        })
    }else{
        res.status(403).json('未登录')
    }
}
/**
 * 根据身份获取用户发布的项目或是作品
 */
exports.getProject = function(req, res, next){
    if(checkIsLogin(req.session)){
        const userId = req.params.userId;
        const identify = String(req.params.identify);
        if(identify === '0'){
            User.findById(userId).populate('projects').exec((err, user) => {
                if(err) throw err;
                /**
                 * 回头再改
                 */
                res.status(200).send(user.projects);
            })
        }else if(identify === '1'){
            User.findById(userId).populate('works').exec((err, user) => {
                if(err) throw err;
                res.status(200).send(user.works)
            })
        }
    }else{
        res.status(403).json('请登录');
    }
};


/** 
 * 根据字段获取用户的作品收藏列表或是需求收藏列表
*/
exports.getFav = function(req, res, next){
    if(checkIsLogin(req.session)){
        const userId = req.params.userId;
        const type = req.params.type;
        if(type === 'project'){
            _UserFindById(userId, 'projects', (err, user) => {
                if(err) throw err;
                res.status(200).send(user.favorites_project);                      
            })
        }else if(type === 'works'){
            _UserFindById(userId, 'works', (err, user) => {
                if(err) throw err;
                res.status(200).send(user.favorite_work);
            })
        }
    }else{
        res.status(403).json('请登录');
    }
}

/**
 * 
 * @param {Object} loginUser session中保存的用户 
 */
function checkIsLogin({loginUser}){
    if(loginUser){
        return true
    }
    return false
}

/**
 * 根据userId查找方法
 * @param {String} userId 
 * @param {String} populateInfo 
 * @param {Function} callback 
 */
function _UserFindById(userId, populateInfo, callback){
    User.findById(userId).populate(populateInfo).exec(callback)
}
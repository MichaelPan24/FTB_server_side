const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const fs = require('fs');

const User = require('../models/user');
const Project = require('../models/project');
const Work = require('../models/work');
const Comment = require('../models/comment');

//注册处理
exports.register = function(req, res, next){
    const UserInfo = req.body;
    const avatarData = req.file;
    User.findOne({
        email: UserInfo.email
    }).then(async user => {
        if(user) {
            res.status(400).end('邮箱已被注册');
            return;
        } else {
            avatarData && await fs.rename(avatarData.path, __dirname+ '/../public/upload/avatars/' + avatarData.originalname, (err) => {
                if(err){
                    throw err;
                }
                console.log('updated user avatar')
            }) 
            // const avatar = gravatar.url(UserInfo.email, {s: '200', r: 'pg', d: 'py'});
            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                name: UserInfo.name,
                email: UserInfo.email,
                password: UserInfo.password,
                identify: UserInfo.identify,
                avatar: 'http://119.23.227.22:3303/upload/avatars/'+ avatarData.originalname
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
    }).catch(err => {
        throw err;
    })
}

/**
 * 登陆处理
 */
exports.logIn = function(req, res, next){
    const userInfo = req.body;
    User.findOne({
        email: userInfo.email
    }).populate('favorite_work').populate('favorite_project').then(user => {
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
                    User    
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
        // const userId = req.params.userId;
        const {userId} = _getParams(req);
        const {name, email, password} = req.body;
        const avatarData = req.file ? req.file : null; 

        find: User.findById(userId, async(err, user) => {
            if(err) throw err;
            name && await user.set({name: name});
            email && await User.findOne({email: email}).then(User => {
                if(!User) {return user.set({email: email});}
                else{res.status(403).end('邮箱已存在'); return }
            })
            
            password && await user.set({password: bcrypt.hashSync(password, 10)});

            avatarData && await fs.rename(avatarData.path, __dirname+ '/../public/upload/avatars/' + avatarData.originalname, (err) => {
                if(err){
                    throw err;
                }
                console.log('updated user avatar')
                
            }) 
            avatarData && await user.set({avatar: 'http://119.23.227.22:3303/upload/avatars/'+ avatarData.originalname})

            user.save((err, updatedUser) => {
                if(err) throw err;
                res.status(200).send(updatedUser)
            })
        }).catch(err => {
            throw err;
        })
    }else{
        res.status(403).send('未登录');
    }
}

/**
 * 更新用户的收藏夹,添加或是删除收藏
 * @var {favProject, favWork} 需求或是作品id 
 */
exports.updateFav = function(req, res, next){
    if(checkIsLogin(req.session)){
        const userId = req.params.userId;
        const favProject = req.body.favProject;
        const favWork = req.body.favWork;
        const isFav = parseInt( req.body.isFav);   //isFav 用户是添加还是删除项目, 1为添加, 0为删除
        if(isFav){
            User.findById(userId).exec((err, user) => {
                if(err) throw err;
                favProject && user.favorite_project.push(favProject) && Project.findById(favProject, (err, project) => {
                    if(err) throw err;
                    project.collectedUser.push(userId);
                    project.save();
                });
                    
                favWork && user.favorite_work.push(favWork) && Work.findById(favWork, (err, work) => {
                    if(err) throw err;
                    work.collectedUser.push(userId);
                    work.save();
                });
                    
                user.save((err, updatedUser) => {
                    if(err) return err;
                    res.status(200).json(updatedUser)                    
                });
            })
        }else if(!isFav){
            User.findById(userId).exec((err, user) => {
                if(err) throw err;
                favProject && user.favorite_project.splice(user.favorite_project.map(v=>v.toString()).indexOf(favProject), 1) && Project.findById(favProject, (err, project) => {
                    if(err) throw err;
                    project.collectedUser.splice(project.collectedUser.map(v => v.toString()).indexOf(userId), 1);
                    project.save(); 
                });

                favWork && user.favorite_work.splice(user.favorite_work.map(v => v.toString()).indexOf(userId), 1) && Work.findById(favWork, (err, work) => {
                    if(err) throw err;
                    work.collectedUser.splice(work.collectedUser.map(v => v.toString()).indexOf(userId), 1);
                    work.save()
                })

                user.save((err, updatedUser) => {
                    if(err) throw err;
                    res.status(200).json(updatedUser)
                })
            })
        }
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
            _UserFindById(userId, {path: 'projects'}, (err, user) => {
                if(err) throw err;
                let opts = [
                    {path: 'avatar', select: 'avatar'},
                    {path: 'companyName', select: 'name'},
                    {path: 'contact', select: 'email'}
                ]
                User.populate(user.projects, opts, (err , user) => {
                    if(err) throw err;
	    //   console.log(user);
                    res.status(200).send(user);
                })                     
            });
        }else if(identify === '1'){
            _UserFindById(userId, {path: 'works'}, (err, user) => {
                if(err) throw err;
                let opts = [
                    {path: 'avatar', select: 'avatar'},
                    {path: 'author', select: 'name'},
                    {path: 'contact', select: 'email'}
                ]
                User.populate(user.works, opts, (err , user) => {
                    if(err) throw err;
	    //   console.log(user);
                    res.status(200).send(user);
                })                     
            });
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
        const {userId, type} = _getParams(req);
        // const userId = req.params.userId;
        // const type = String(req.params.type);
        // console.log(type, userId, typeof(userId), typeof type)
        if(type === 'project'){
            _UserFindById(userId, {path: 'favorite_project'}, (err, user) => {
                if(err) throw err;
                let opts = [
                    {path: 'avatar', select: 'avatar'},
                    {path: 'companyName', select: 'name'},
                    {path: 'contact', select: 'email'},
                    {path: 'collectedUser'}
                ]
                User.populate(user.favorite_project, opts, (err , user) => {
                    if(err) throw err;
	    //   console.log(user);
                    res.status(200).send(user);
                })                     
            });
        }else if(type === 'work'){
            _UserFindById(userId, {path: 'favorite_work'}, (err, user) => {
                if(err) throw err;
                let opts = [
                    {path: 'avatar', select: 'avatar'},
                    {path: 'author', select: 'name'},
                    {path: 'contact', select: 'email'},
                    {path: 'collectedUser'}
                ]
                User.populate(user.favorite_work, opts, (err , user) => {
                    if(err) throw err;
	    //   console.log(user);
                    res.status(200).send(user);
                })
                
            });
        }
    }else{
        res.status(403).json('请登录');
    }
}

/**
 * 
 */
exports.removeProject = function(req, res, next){
    if(checkIsLogin(req.session)){
        const paramObj = _getParams(req);
        const {userId, removeType} = paramObj;
        const {projectIdArr} = req.body;
        switch(removeType){
            case 'removeProject':
                removeProject(userId, projectIdArr, 'projects');
                break;
            case 'removeWork':
                removeProject(userId, projectIdArr, 'works');
            case 'removeFavProject':
                removeProject(userId, projectIdArr, 'favorite_project');
                break;
            case 'removeFavWork':
                removeProject(userId, projectIdArr, 'favorite_work');
                break;
        }

    }
}

exports.pushComment = function(req, res, next){
    if(checkIsLogin(req.session)){
        const {userId, workId} = _getParams(req);
        const {detail} = req.body;
        const newComment = new Comment({
            _id: new mongoose.Types.ObjectId(),
            avatar: new mongoose.Types.ObjectId(userId),
            commentDetail: detail,
            author: new mongoose.Types.ObjectId(userId),
            work: new mongoose.Types.ObjectId(workId)
        })
        newComment.save( async (err, newComment) => {
            if(err) throw err;
            try{ await  Work.findById(workId, (err, work) => {
                if(err) throw err;
                work.comments.push(newComment._id)
                work.save()
                res.status(200).send(newComment)
            })}catch(e){
                throw e;
            }
            // await User.findById(userId, (err, user) => {
            //     if(err) throw err;
            //     user.com
            // })
        });
    }else{
        res.status(403).send('请登录')
    }
}

/**
 * 
 * @param {String} userId 
 * @param {Arr} projectIdArr 
 * @param {String} removeType 
 */
function removeProject(userId, projectIdArr, removeType){
    return User.findById(userId, (err, user) => {
            if(err) throw err;
            projectIdArr.forEach((project ,index) => {
                user[removeType].splice(user[removeType].indexOf(project), 1);
            });
            user.save((err, updateUser) => {
                if(err) throw err;
                res.status(200).send(updateUser);
            })
        })
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
 * @param {String || Object} populateInfo 
 * @param {Function} callback 
 */
function _UserFindById(userId, populateInfo, callback){
   return User.findById(userId).populate(populateInfo).exec(callback)
}

/**
 * 拿取url参数操作
 * @param {Object} req 
 */
function _getParams(req){
    let paramObj = Object.assign({}, req.params);
    return paramObj;
}
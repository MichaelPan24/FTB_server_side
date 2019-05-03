const Work = require('../models/work');
const User = require('../models/user');
const Comment = require('../models/comment');

const fs = require('fs');
const mongoose = require('mongoose');

const getParams = require('../utils/commentUtil').getParams;
const findMethod = require('../utils/commentUtil').FindMethod;

exports.getCurrentWork = function(req, res, next){
    // findMethod.findAll(Work, {path: 'avatar', select: ''})
    Work.find().populate({path: 'avatar', select: 'avatar'}).populate({path: 'author', select: 'name'}).populate({path: 'contact', select: 'email'}).populate({path: 'collectedUser', select: '_id'}).exec((err, works) => {
        if(err) throw err;
        res.status(200).send(works)
    })
}

exports.uploadWork = function(req, res, next){
    const workData = req.body;
    const {loginUser} = req.session;
    if(loginUser){
        const imageData = req.files ;
        const imgArr = [];
        for(let i=0, len=imageData.length; i<len; i++){
            fs.rename(imageData[i].path,  __dirname + '/../public/upload/works/' + imageData[i].originalname, (err)=> {
                if(err){
                    throw err;
                }
                console.log('uploaded works');
            })
            imgArr.push('http://119.23.227.22:3303/upload/works/'+ imageData[i].originalname)
        }

        // User.findById(loginUser._id, (err, user) => {
        //     if(err) throw err;
        //     avatar = user.avatar
        // })
        
        const newWork = new Work({
            _id: new mongoose.Types.ObjectId(),
            avatar:  loginUser._id ,
            author: loginUser._id,
            title: workData.title,
            description: workData.description,
            image: imgArr  ,
            contact: loginUser._id,
        });
        newWork.save()
            .then(newWork => {
                User.findById(loginUser._id).populate('works').exec((err, user) => {
                    if(err) throw err;
                    user.works.push(newWork);
                    user.save((err, newUser) => {
                        if(err) throw err;
                        res.status(200).send(newUser.works)
                    })
                })
                // User.findById(loginUser._id, (err, user) => {
                //     if(err) throw err;
                //     user.works.push(newWork._id);
                //     user.save((err, newWork) => {
                //         if(err) throw err;
                //         res.status(200).send(newWork);
                //     });
                // })
                // res.status(200).send(newWork);   
            })
            .catch(err => {
                throw err;
            })
    } else if(loginUser && loginUser.identify !== '1'){
        res.status(403).send('作品展示仅限于学生用户')
    } else{
        res.status(400).send('请您先登陆')
    }
}

exports.getComment = function(req, res, next){
    const {workId} = req.params;
    Work.findById(workId).populate({path: 'comments'}).exec((err, comment) => {
        if(err) throw err;
        let opts =[
            {path: 'avatar', select: 'avatar'},
            {path: 'author', select: 'name'}
        ]
        Work.populate(comment.comments, opts, (err, works) => {
            if(err) throw err;
            res.status(200).send(works);
        })
    })
}


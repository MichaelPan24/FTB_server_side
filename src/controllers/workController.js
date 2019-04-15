const Work = require('../models/work');
const User = require('../models/user');
const fs = require('fs');
const mongoose = require('mongoose');

exports.getCurrentWork = function(req, res, next){
    Work.find({}, (err, works) => {
        if(err) throw err;
        res.send(works)
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
            imgArr.push('http://192.168.1.103:3301/upload/works/'+ imageData[i].originalname)
        }
        const newWork = new Work({
            _id: new mongoose.Types.ObjectId(),
            avatar: loginUser.avatar || null,
            author: loginUser.name,
            title: workData.title,
            description: workData.description,
            image: imgArr  ,
            contact: loginUser.contact,
        });
        newWork.save()
            .then(newWork => {
                User.findById(loginUser._id, (err, user) => {
                    if(err) throw err;
                    user.works.push(newWork._id);
                    user.save((err, newWork) => {
                        if(err) throw err;
                        res.status(200).send(newWork);
                    });
                })
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
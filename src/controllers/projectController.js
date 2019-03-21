const Project = require('../models/project');
const fs = require('fs');

/**
 * 上传图片文件的临时路径是../public/upload/projects/
 *
 */

exports.getCurrentProject = (req, res, next) => {
        Project.find({},(err, projects) => {
            if(err) console.log(err);
            res.send(projects);
    })
}

exports.uploadProject = (req, res, next) => {
    //检验是否为已登陆用户,并且验证其身份是否为企业,如是才可进行插入操作

    const projectData = req.body;
    const {loginUser}= req.session;
    if(loginUser){
        const imageData = req.files;
        const imgArr = [];
        for(let i=0, len=imageData.length; i<len; i++){
            fs.rename(imageData[i].path,  __dirname + '/../public/upload/projects/' + imageData[i].originalname, (err)=> {
                if(err){
                    throw err;
                }
                console.log('uploaded');
            })
            imgArr.push('192.168.1.130:3301/upload/projects'+ imageData[i].originalname)
        }
        const newProject = new Project({
            avatar: loginUser.avatar || null,
            companyName: loginUser.name,
            title: projectData.title,
            description: projectData.description,
            image: imgArr  ,
            contact: loginUser.contact,
            date: projectData.date
        });
        newProject.save()
            .then(newProject => {
                res.status(200).send(newProject);   
            })
            .catch(err => {
                console.log(err);
            })
    } else if (loginUser && loginUser.identify !== '0'){
        res.status(403).send('学生不可以发布需求哦'); 
    } else {
        res.status(403).send('请您先登陆'); 
    }
}
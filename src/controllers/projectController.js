const Project = require('../models/project');

exports.getCurrentProject = (req, res, next) => {
        Project.find({},(err, projects) => {
            if(err) console.log(err);
            res.set({'Access-Control-Allow-Origin': '*'})
            res.send(projects);
    })
}

exports.addProject = (req, res, next) => {
    //检验是否为已登陆用户,并且验证其身份是否为企业,如是才可进行插入操作
    const projectData = req.body;
    const loginUser = req.session;
    if(loginUser && loginUser.identify === '0'){
        const newProject = new Project({
            companyName: projectData.companyName,
            title: projectData.title,
            description: projectData.description,
            contact: projectData.contact,
            date: projectData.date
        });
        newProject.save()
            .then(newProject => {
                res.status(200).json('恭喜您,上传成功') && res.redirect('/');
            })
            .catch(err => {
                console.log(err);
            })
    } else if (loginUser && loginUser.identify !== '0'){
        res.send('学生不可以发布需求哦') && res.redirect('');
    } else {
        res.send('请您先登陆') && res.redirect('/api/user/login');
    }
}
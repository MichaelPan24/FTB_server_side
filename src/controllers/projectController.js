const Project = require('../models/project');

exports.getCurrentProject = (req, res, next) => {
        Project.find({},(err, projects) => {
            if(err) console.log(err);
            res.send(projects);
    })
}

exports.insertProject = (req, res, next) => {
    //检验是否为已登陆用户,如是才可进行插入操作
    const projectData = req.body;
    if(req.session.id){
        const newProject = new Project({
            companyName: projectData.companyName,
            title: projectData.title,
            description: projectData.description,
            contact: projectData.contact,
            date: projectData.date
        })
    }else {
        res.redirect('../login');
    }
}
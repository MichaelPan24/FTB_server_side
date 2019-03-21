const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;
//定义项目模式
const ProjectSchema = new Schema({
    avatar: {type: String},
    companyName: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: Array},
    contact: {type: Object, required: true},
    date: {type: Date, default: Date.now}
});

//转为项目模型(collection)
const Project = Model('project', ProjectSchema)
module.exports = Project;
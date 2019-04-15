const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;
//定义项目模式
const ProjectSchema = new Schema({
    _id: Schema.Types.ObjectId,
    collectedUser: [{type: Schema.Types.ObjectId, ref: 'users'}],   //关联收藏的用户
    // avatar: {type: Schema.Types.ObjectId, ref: 'users'},
    avatar: {type: String},
    // companyName: {type: Schema.Types.ObjectId, ref: 'users'},
    companyName: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: Array},
    contact: {type: Object, required: true},
    // contact: {type: Schema.Types.ObjectId, ref: 'users'},
    date: {type: Date, default: Date.now}
});

//转为项目模型(collection)
const Project = Model('projects', ProjectSchema)
module.exports = Project;
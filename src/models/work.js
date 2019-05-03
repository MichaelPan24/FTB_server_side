const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;

const workSchema = new Schema({
    _id: Schema.Types.ObjectId,
    avatar: {type: Schema.Types.ObjectId, ref: 'users'},
    collectedUser: [{type: Schema.Types.ObjectId, ref: 'users'}],     //关联收藏的用户
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: Array, required: true},
    date: {type: Date, default: Date.now()},
    /**
     * 考虑到客户端读取的速度以及管理的便捷并没有使用表管理而是从session中取出一下两条用户信息
     */
    author: {type: Schema.Types.ObjectId, ref: 'users', required: true},
    contact: {type: Schema.Types.ObjectId, ref: 'users', require: true},
    comments: [{type: Schema.Types.ObjectId, ref: 'comments'}]    //评论
});

const workModel = Model('works', workSchema);

module.exports = workModel;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const model = mongoose.model;

const workSchema = new Schema({
    _id: Schema.Types.ObjectId,
    avatar: {type: String},
    collectedUser: {type: Schema.Types.ObjectId, ref: 'users'},     //关联收藏的用户
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: Array, required: true},
    date: {type: Date, default: Date.now()},
    /**
     * 考虑到客户端读取的速度以及管理的便捷并没有使用表管理而是从session中取出一下两条用户信息
     */
    author: {type: String, required: true},
    contact: {type: String, require: true},
    comments: {type: Schema.Types.ObjectId, ref: 'comments'}    //评论
});

const workModel = model('work', workSchema);

module.exports = workModel;
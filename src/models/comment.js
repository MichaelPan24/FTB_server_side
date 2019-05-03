const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;

const commentSchema = new Schema({
    _id: Schema.Types.ObjectId,
    avatar: {type: Schema.Types.ObjectId, ref: 'users'},
    commentDetail: {type: String, required: true},
    date: {type: Date, default: Date.now()},
    author: {type: Schema.Types.ObjectId, ref: 'users', required: true},
    work: {type: Schema.Types.ObjectId, ref: 'works'}
});

const commentModel = Model('comments', commentSchema);

module.exports = commentModel;
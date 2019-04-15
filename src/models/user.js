const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;

const UserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {type: String, required: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    identify: {type: String, required: true, enum: ['0', '1']},//身份类型, 0为企业,1为个人或者学生
    avatar: String,
    projects: [{type: Schema.Types.ObjectId, ref: 'projects'}],
    works: [{type: Schema.Types.ObjectId, ref: 'works'}],
    favorite_work: [{type: Schema.Types.ObjectId, ref: 'works'}],
    favorite_project: [{type: Schema.Types.ObjectId, ref: 'projects'}]
})

const User = Model('users', UserSchema);
module.exports = User;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model = mongoose.model;

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    identify: {type: String, required: true, enum: ['0', '1']},//身份类型, 0为企业,1为个人或者学生
    avatar: String
})

const User = Model('Users', UserSchema);
module.exports = User;
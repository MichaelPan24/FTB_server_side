const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const model = mongoose.model;

const workSchema = new Schema({

});

const workModel = model('work', workSchema);

module.exports = workModel;
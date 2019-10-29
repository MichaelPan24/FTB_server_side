const mongoose = require('mongoose')

mongoose.Promise = global.Promise;


exports.connect = () => mongoose.connect('mongodb+srv://pan:*******@ftb-xqfem.mongodb.net/ftb', {
    useNewUrlParser: true,
    dbName: 'ftb',
    keepAlive: true
})
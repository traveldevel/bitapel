
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, { useMongoClient: true });
mongoose.Promise = global.Promise;

var mongooseModels = require('./bitapel-mongoose-models');

module.exports.registerUser = exports.registerUser = function(req, res){
    let user = {};
    return user;
}
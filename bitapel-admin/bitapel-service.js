var uniqueString = require('unique-string');

var mongooseModels = require('./bitapel-mongoose-models');
var fabricService = require('./bitapel-fabric-service');

module.exports.registerUser = exports.registerUser = function(req, res){

    var SECRET_KEY = uniqueString();
    
    var newUser = new mongooseModels.BitApelUser({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : req.body.password,
        createdAt : new Date()
    });

    newUser.save(function(err, savedNewUser) {
        if (err) {
            res.json(err);
        } 
        else 
        {
            fabricService.createUser(newUser, res);
        }
    });
}
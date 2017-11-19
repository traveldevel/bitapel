
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, { useMongoClient: true });
mongoose.Promise = global.Promise;

var mongooseModels = require('./bitapel-mongoose-models');
var aesEnc = require('./bitapel-encrypt');

module.exports.getUserById = exports.getUserById = function(req, res, uId){

    mongooseModels.BitApelUser.findById(uId, function (err, user) {
        if (err) {
            console.log('get mongo user error : ', err);
        }

        console.log(user);

        user.password = '';
        user.email = aesEnc.decrypt(user.email, uId);
        user.firstName = aesEnc.decrypt(user.firstName, uId);
        user.lastName = aesEnc.decrypt(user.lastName, uId);

        res.json(user);
    });
}

module.exports.updateUser = exports.updateUser = function(req, res, uId, changedUser){
    
    mongooseModels.BitApelUser.findById(uId, function (err, user) {
        if (err) {
            console.log('get mongo user error : ', err);
        }

        console.log(user);

        if(user !== undefined && user.id === uId && user.id === changedUser.id){
           
            user.firstName = aesEnc.encrypt(changedUser.firstName, uId);
            user.lastName = aesEnc.encrypt(changedUser.lastName, uId);
    
            if(changedUser.password !== undefined && changedUser.password !== null && changedUser.password.length > 0){
                user.password = aesEnc.encrypt(changedUser.password, "bitapelbitapelbitapel");
            }

            user.save(function(err, user2){
                if(!err){
                    console.log("error update user in mongo : ", err);
                }

                console.log(user2);
            })

            res.json(user);
        }
    });
}

const FABRIC_COMPOSER_REST_URL = process.env.FABRIC_COMPOSER_REST_URL;

var request = require('request');
var uniqueString = require('unique-string');

var aesEnc = require('./bitapel-encrypt');

module.exports.createUser = exports.createUser = function(newUser, res){
    
    var savedId = newUser._id.toString();
    var blockchainId = aesEnc.encrypt(savedId, savedId);
    
    var blockchainUser = {
        "$class": "org.bitapel.model.User",
        "id": blockchainId
    };

    request({
        url: FABRIC_COMPOSER_REST_URL + "/api/User",
        method: "POST",
        json: true,
        body: blockchainUser
    }, function (error, response, body){
        
        //console.log(error, body);

        if (!error && response.statusCode == 200) {

            newUser.firstName = aesEnc.encrypt(newUser.firstName, savedId);
            newUser.lastName = aesEnc.encrypt(newUser.lastName, savedId);
            newUser.email = aesEnc.encrypt(newUser.email, savedId);
            newUser.password = aesEnc.encrypt(newUser.password, "bitapelbitapelbitapel");        

            newUser.save(function (err2, newUserUpdated) {
                if (err2) {
                    res.json(err2);
                } 
                else{
                    res.json(newUserUpdated);
                }
            });
        }                
    });
}

module.exports.getUser = exports.getUser = function(email, password){
    let user = {};
    return user;
}
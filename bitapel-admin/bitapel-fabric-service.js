
const FABRIC_COMPOSER_REST_URL = process.env.FABRIC_COMPOSER_REST_URL;

var request = require('request');
var uniqueString = require('unique-string');

var aesEnc = require('./bitapel-encrypt');

// user functions
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
            newUser.encryptedSuccesuful = true;
            
            newUser.save(function (err2, newUserUpdated) {
                if (err2) {
                    res.json(err2);
                } 
                else{
                    res.json(newUserUpdated);
                }
            });
        }
        else{
            console.log("createUser error : ", error);
        }                
    });
}

module.exports.getUser = exports.getUser = function(id){
  
    var getUserPromise = new Promise(
        
        function(resolve, reject){

            request({
                url: FABRIC_COMPOSER_REST_URL + "/api/User",
                method: "GET"
            }, function (error, response, body){
                
                //console.log(error, body);
        
                if (!error && response.statusCode == 200) {
                    
                    var users = JSON.parse(body);
                    //console.log(users);
                    
                    var count = users.length;
                    for(var i = 0; i < count; i++){

                        var decryptedId = aesEnc.decrypt(users[i].id, id);
                        //console.log("decryptedId : ", decryptedId);

                        if(decryptedId === id){
                            resolve(users[i]);
                            break;
                        }
                    }

                    reject(new Error("User " + id + " not found"));
                }       
                else{
                    console.log("getUser error : ", error);
                    reject(error);
                }                         
        
            });

        }
    );

    return getUserPromise;
}

// thing functions
module.exports.getThingsForUserMenu = exports.getThingsForUserMenu = function(bId){
    var getThingsPromise = new Promise(
        
        function(resolve, reject){

            var filter = {
                where: {
                    owner: "resource:org.bitapel.model.User#id:" + bId
                }
            };

            var filterQuery = encodeURIComponent(JSON.stringify(filter));

            request({
                url: FABRIC_COMPOSER_REST_URL + "/api/Thing?filter=" + filterQuery,
                method: "GET"
            }, function (error, response, body){
                
                //console.log(error, body);
        
                if (!error && response.statusCode == 200) {
                    
                    var things = JSON.parse(body);
                    //console.log(things);
                    
                    resolve(things);
                }       
                else{
                    console.log("getUserThingsForMenu error : ", error);
                    reject(error);
                }                         
        
            });

        }
    );

    return getThingsPromise;
}

module.exports.createThing = exports.createThing = function(uId, newThing, res){

    request({
        url: FABRIC_COMPOSER_REST_URL + "/api/Thing",
        method: "POST",
        json: true,
        body: newThing
    }, function (error, response, body){
        
        //console.log(error, body);

        if (!error && response.statusCode == 200) {
            res.json(newThing);
        }
        else{
            console.log("createThing error : ", error);
        }                
    });
}

module.exports.getThingsForUser = exports.getThingsForUser = function(bId){
    var getThingsPromise = new Promise(
        
        function(resolve, reject){

            var filter = {
                where: {
                    owner: "resource:org.bitapel.model.User#id:" + bId
                }
            };

            var filterQuery = encodeURIComponent(JSON.stringify(filter));

            request({
                url: FABRIC_COMPOSER_REST_URL + "/api/Thing?filter=" + filterQuery,
                method: "GET"
            }, function (error, response, body){
                
                //console.log(error, body);
        
                if (!error && response.statusCode == 200) {
                    
                    var things = JSON.parse(body);
                    //console.log(things);
                    
                    resolve(things);
                }       
                else{
                    console.log("getThings error : ", error);
                    reject(error);
                }                         
        
            });

        }
    );

    return getThingsPromise;
}

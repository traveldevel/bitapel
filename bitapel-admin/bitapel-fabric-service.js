
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
                    console.log("getUserThingsForMenu error : ", response);
                    reject(error);
                }                         
        
            });

        }
    );

    return getThingsPromise;
}

module.exports.createThing = exports.createThing = function(newThing, res){

    //console.log(newThing);

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
            console.log("createThing error : ", body);
        }                
    });
}

module.exports.saveThing = exports.saveThing = function(saveThing, res){

    //console.log(saveThing);

    request({
        url: FABRIC_COMPOSER_REST_URL + "/api/Thing/" + encodeURI(saveThing.id),
        method: "PUT",
        json: true,
        body: saveThing
    }, function (error, response, body){
        
        //console.log(error, body);

        if (!error && response.statusCode == 200) {
            res.json(saveThing);
        }
        else{
            console.log("saveThing error : ", response);
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
                    console.log("getThings error : ", response);
                    reject(error);
                }                         
        
            });

        }
    );

    return getThingsPromise;
}

module.exports.getThing = exports.getThing = function(tId, bId){
    var getThingPromise = new Promise(
        
        function(resolve, reject){

            var filter = {
                where: {
                    id: tId,
                    owner: "resource:org.bitapel.model.User#id:" + bId
                }
            };

            var filterQuery = encodeURIComponent(JSON.stringify(filter));

            request({
                url: FABRIC_COMPOSER_REST_URL + "/api/Thing/" + tId + "?filter=" + filterQuery,
                method: "GET"
            }, function (error, response, body){
                
                //console.log(error, body);
        
                if (!error && response.statusCode == 200) {
                    
                    var thing = JSON.parse(body);
                    //console.log(thing);
                    
                    resolve(thing);
                }       
                else{
                    console.log("getThing error : ", response);
                    reject(error);
                }                         
        
            });

        }
    );

    return getThingPromise;
}

// get event transactions
module.exports.getThingBuyLog = exports.getThingBuyLog = function(tId, bId){
    var getThingLogPromise = new Promise(
        
        function(resolve, reject){

            var filter = {
                where: {
                    thing: "resource:org.bitapel.model.Thing#id:" + tId,
                    owner: "resource:org.bitapel.model.User#id:" + bId
                }
            };

            var filterQuery = encodeURIComponent(JSON.stringify(filter));

            request({
                url: FABRIC_COMPOSER_REST_URL + "/api/BuyEvent" + "?filter=" + filterQuery,
                method: "GET"
            }, function (error, response, body){
                
                //console.log(error, body);
        
                if (!error && response.statusCode == 200) {
                    
                    var records = JSON.parse(body);
                    //console.log(thing);
                    
                    resolve(records);
                }       
                else{
                    console.log("getThing Buy Events error : ", response);
                    reject(error);
                }                         
        
            });

        }
    );

    return getThingLogPromise;
}

module.exports.getThingSaleLog = exports.getThingSaleLog = function(tId, bId){
    var getThingLogPromise = new Promise(
        
        function(resolve, reject){

            var filter = {
                where: {
                    thing: "resource:org.bitapel.model.Thing#id:" + tId,
                    owner: "resource:org.bitapel.model.User#id:" + bId
                }
            };

            var filterQuery = encodeURIComponent(JSON.stringify(filter));

            request({
                url: FABRIC_COMPOSER_REST_URL + "/api/SaleEvent" + "?filter=" + filterQuery,
                method: "GET"
            }, function (error, response, body){
                
                //console.log(error, body);
        
                if (!error && response.statusCode == 200) {
                    
                    var records = JSON.parse(body);
                    //console.log(thing);
                    
                    resolve(records);
                }       
                else{
                    console.log("getThing Sale Events error : ", response);
                    reject(error);
                }                         
        
            });

        }
    );

    return getThingLogPromise;
}

// create event transactions
module.exports.createBuyEvent = exports.createBuyEvent = function(newEvent, res){
    
    //console.log(newEvent);

    request({
        url: FABRIC_COMPOSER_REST_URL + "/api/BuyEvent",
        method: "POST",
        json: true,
        body: newEvent
    }, function (error, response, body){
        
        //console.log(error, body);

        if (!error && response.statusCode == 200) {
            res.json(newEvent);
        }
        else{
            console.log("createBuyEvent error : ", body);
        }                
    });
}

module.exports.createSaleEvent = exports.createSaleEvent = function(newEvent, res){
    
    //console.log(newEvent);

    request({
        url: FABRIC_COMPOSER_REST_URL + "/api/SaleEvent",
        method: "POST",
        json: true,
        body: newEvent
    }, function (error, response, body){
        
        //console.log(error, body);

        if (!error && response.statusCode == 200) {
            res.json(newEvent);
        }
        else{
            console.log("createSaleEvent error : ", body);
        }                
    });
}

module.exports.createInfoEvent = exports.createInfoEvent = function(newEvent, res){
    
    //console.log(newEvent);

    request({
        url: FABRIC_COMPOSER_REST_URL + "/api/InfoEvent",
        method: "POST",
        json: true,
        body: newEvent
    }, function (error, response, body){
        
        //console.log(error, body);

        if (!error && response.statusCode == 200) {
            res.json(newEvent);
        }
        else{
            console.log("createInfoEvent error : ", body);
        }                
    });
}

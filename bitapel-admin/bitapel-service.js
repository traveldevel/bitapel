var uniqueString = require('unique-string');

var mongooseModels = require('./bitapel-mongoose-models');
var fabricService = require('./bitapel-fabric-service');
var aesEnc = require('./bitapel-encrypt');

// user functions
module.exports.registerUser = exports.registerUser = function(req, res){

    var SECRET_KEY = uniqueString();
    
    var newUser = new mongooseModels.BitApelUser({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : req.body.password,
        createdAt : new Date(),
        markedForDeletion: false,
        willBeDeletedOn: null,
        emailIsConfirmed: false,
        encryptedSuccesuful: false
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

module.exports.loginUser = exports.loginUser = function(req, res){
    
    var email = req.body.email;
    var password = req.body.password;
    console.log(email, password);

    mongooseModels.BitApelUser.find({}, function(err, users){
        
        if(err){
            res.json(err);
        }

        //console.log(users);

        var userCount = users.length;

        for(var i = 0; i < userCount; i++){

            var d_pass = aesEnc.decrypt(users[i].password, "bitapelbitapelbitapel"); 
            console.log(d_pass);

            if(d_pass === password){

                console.log("Passwords match !");

                var savedId = users[i]["_id"].toString();
                var d_email = aesEnc.decrypt(users[i].email, savedId); 

                console.log("decrypted email : ", d_email, savedId);

                if(d_email === email){

                    users[i].email = aesEnc.decrypt(users[i].email, savedId); 
                    users[i].firstName = aesEnc.decrypt(users[i].firstName, savedId); 
                    users[i].lastName = aesEnc.decrypt(users[i].lastName, savedId); 

                    res.json(users[i]);

                    break;
                }
            }
        }
    });
}

module.exports.whichUser = exports.whichUser = function(req, res, id){
    
    fabricService.getUser(id).then(function(user){
        //console.log(user);
        res.json(user);
    });
}

// thing functions
module.exports.getThingsForUserMenu = exports.getThingsForUser = function(req, res, bId, uId){
    fabricService.getThingsForUserMenu(bId).then(function(things){
        //console.log(things);
        
        var menu = {
            "navigation": [
                {
                    "title": "Home",
                    "icon": "sap-icon://home",
                    "expanded": true,
                    "key": "home"
                },
                {
                    "title": "Account",
                    "icon": "sap-icon://settings",
                    "key": "userAccount"
                },
                {
                    "title": "Things",
                    "icon": "sap-icon://tree",
                    "key": "things",
                    "items": []
                }
            ],
            "fixedNavigation": [
                {
                    "title": "Important Links",
                    "icon": "sap-icon://chain-link",
                    "key": "links"
                },
                {
                    "title": "Legal",
                    "icon": "sap-icon://compare",
                    "key": "legalInfo"
                }
            ]
        };

        for(var i = 0; i < things.length; i++){
            menu.navigation[2].items.push({
                "title": aesEnc.decrypt(things[i].name, uId),
                "icon": "sap-icon://course-book",
                "key": things[i].id,
            }); 
        }
    
        res.json(menu);
    });
}

module.exports.createThing = exports.createThing = function(req, res, uId, newThing){

    var newThingEnc = newThing;
    
    newThingEnc.name = aesEnc.encrypt(newThingEnc.name, uId);
    newThingEnc.serial = aesEnc.encrypt(newThingEnc.serial, uId);
    newThingEnc.category = aesEnc.encrypt(newThingEnc.category, uId);
    newThingEnc.manufacturer = aesEnc.encrypt(newThingEnc.manufacturer, uId);
    newThingEnc.type = aesEnc.encrypt(newThingEnc.type, uId);
    newThingEnc.buyDate = aesEnc.encrypt(newThingEnc.buyDate, uId);

    fabricService.createThing(uId, newThingEnc, res);    
}

module.exports.getAllThings = exports.getAllThings = function(req, res, uId, bId){
    
    fabricService.getThingsForUser(bId).then(function(thingsEnc){
        
        //console.log(thingsEnc);

        var things = [];

        var n = thingsEnc.length;

        for(var i = 0; i < n; i++){

            var thing = thingsEnc[i];

            thing.name = aesEnc.decrypt(thingsEnc[i].name , uId);
            thing.serial = aesEnc.decrypt(thingsEnc[i].serial , uId);
            thing.category = aesEnc.decrypt(thingsEnc[i].category , uId);
            thing.manufacturer = aesEnc.decrypt(thingsEnc[i].manufacturer , uId);
            thing.type = aesEnc.decrypt(thingsEnc[i].type , uId);
            thing.buyDate = aesEnc.decrypt(thingsEnc[i].buyDate , uId);

            //console.log(thing);

            things.push(thing);
        }

        res.json(things);
    });
}

module.exports.getThing = exports.getThing = function(req, res, uId, bId, tId){
    
    fabricService.getThing(tId, bId).then(function(thingEnc){
        
        //console.log(thingEnc);

        var thing = thingEnc;

        thing.name = aesEnc.decrypt(thingEnc.name , uId);
        thing.serial = aesEnc.decrypt(thingEnc.serial , uId);
        thing.category = aesEnc.decrypt(thingEnc.category , uId);
        thing.manufacturer = aesEnc.decrypt(thingEnc.manufacturer , uId);
        thing.type = aesEnc.decrypt(thingEnc.type , uId);
        thing.buyDate = aesEnc.decrypt(thingEnc.buyDate , uId);

        res.json(thing);
    });
}
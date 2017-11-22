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

        var found = false;
        for(var i = 0; i < userCount; i++){

            var d_pass = aesEnc.decrypt(users[i].password, "bitapelbitapelbitapel"); 
            console.log(d_pass);

            if(d_pass === password){

                console.log("Passwords match !");

                var savedId = users[i]["_id"].toString();
                var d_email = aesEnc.decrypt(users[i].email, savedId); 

                console.log("decrypted email : ", d_email, savedId);

                if(d_email === email && users[i].markedForDeletion === false){

                    users[i].email = aesEnc.decrypt(users[i].email, savedId); 
                    users[i].firstName = aesEnc.decrypt(users[i].firstName, savedId); 
                    users[i].lastName = aesEnc.decrypt(users[i].lastName, savedId); 

                    found = true;
                    res.json(users[i]);

                    break;
                }
            }
        }

        if(!found){
            res.json({});
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
    
    newThingEnc.name = aesEnc.encrypt(newThing.name, uId);
    newThingEnc.serial = aesEnc.encrypt(newThing.serial, uId);
    newThingEnc.category = aesEnc.encrypt(newThing.category, uId);
    newThingEnc.manufacturer = aesEnc.encrypt(newThing.manufacturer, uId);
    newThingEnc.type = aesEnc.encrypt(newThing.type, uId);
    newThingEnc.buyDate = aesEnc.encrypt(newThing.buyDate, uId);

    //console.log(newThingEnc);

    fabricService.createThing(newThingEnc, res);    
}

module.exports.saveThing = exports.saveThing = function(req, res, uId, saveThing){

    var saveThingEnc = saveThing;
    
    saveThingEnc.name = aesEnc.encrypt(saveThingEnc.name, uId);
    saveThingEnc.serial = aesEnc.encrypt(saveThingEnc.serial, uId);
    saveThingEnc.category = aesEnc.encrypt(saveThingEnc.category, uId);
    saveThingEnc.manufacturer = aesEnc.encrypt(saveThingEnc.manufacturer, uId);
    saveThingEnc.type = aesEnc.encrypt(saveThingEnc.type, uId);
    saveThingEnc.buyDate = aesEnc.encrypt(saveThingEnc.buyDate, uId);

    //console.log(saveThingEnc);

    fabricService.saveThing(saveThingEnc, res);
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

// get history functions
module.exports.getThingBuyAndSell = exports.getThingBuyAndSell = function(req, res, uId, tId, uId, bId){
    
    fabricService.getThingBuyLog(tId, bId).then(function(buyRecords){
        
        fabricService.getThingSaleLog(tId, bId).then(function(saleRecords){

            //console.log(buyRecords);

            var allRecords = [];

            // translate buy records
            var bn = buyRecords.length;
            for(var i = 0; i < bn; i++){
                
                var record = buyRecords[i];

                record.type = "Buy";
                record.recordedBy = aesEnc.decrypt(record.recordedBy, uId);
                record.totalWorkingUnits = aesEnc.decrypt(record.totalWorkingUnits, uId);
                record.totalWorkingUnitType = aesEnc.decrypt(record.totalWorkingUnitType, uId);
                record.buyDate = aesEnc.decrypt(record.buyDate, uId);
                record.buyFrom = aesEnc.decrypt(record.buyFrom, uId);
                record.buyPrice = aesEnc.decrypt(record.buyPrice, uId);
                record.buyPriceCurrency = aesEnc.decrypt(record.buyPriceCurrency, uId);
                record.buyDetails = aesEnc.decrypt(record.buyDetails, uId); 

                record.date = record.buyDate;
                delete record.buyDate;

                if(record.buyDetails !== undefined && record.buyDetails !== null){
                    record.details = record.buyDetails;
                }
                else{
                    record.details = '';
                }
                delete record.buyDetails;

                if(record.buyFrom !== undefined && record.buyFrom !== null){
                    record.info = record.buyFrom;
                }
                else{
                    record.info = '';
                }
                delete record.buyFrom;       
                
                if(record.buyPrice !== undefined && record.buyPrice !== null){
                    record.price = record.buyPrice + " " + record.buyPriceCurrency;
                }
                else{
                    record.price = '';
                }
                delete record.buyPrice;                
                delete record.buyPriceCurrency;

                allRecords.push(record);
            }

            // translate sale records
            var sn = saleRecords.length;
            for(var i = 0; i < sn; i++){
                
                var record = saleRecords[i];

                record.type = "Sale";
                record.recordedBy = aesEnc.decrypt(record.recordedBy, uId);
                record.totalWorkingUnits = aesEnc.decrypt(record.totalWorkingUnits, uId);
                record.totalWorkingUnitType = aesEnc.decrypt(record.totalWorkingUnitType, uId);
                record.saleDate = aesEnc.decrypt(record.saleDate, uId);
                record.saleDetails = aesEnc.decrypt(record.saleDetails, uId); 

                record.date = record.saleDate;
                delete record.saleDate;

                if(record.saleDetails !== undefined && record.saleDetails !== null){
                    record.details = record.saleDetails;
                }
                else{
                    record.details = '';
                }
                delete record.saleDetails;    
                
                record.info = '';
                record.price = '';

                allRecords.push(record);
            }

            var recordsResponse = {
                count : allRecords.length,
                rows : allRecords
            }

            res.json(recordsResponse);
        });
    });
}

module.exports.getThingInfo = exports.getThingInfo = function(req, res, uId, tId, uId, bId){
    
    fabricService.getThingInfoLog(tId, bId).then(function(infoRecords){

        //console.log(infoRecords);

        var allRecords = [];

        var n = infoRecords.length;
        for(var i = 0; i < n; i++){
            
            var record = infoRecords[i];

            record.recordedBy = aesEnc.decrypt(record.recordedBy, uId);
            record.totalWorkingUnits = aesEnc.decrypt(record.totalWorkingUnits, uId);
            record.totalWorkingUnitType = aesEnc.decrypt(record.totalWorkingUnitType, uId);
            record.infoDate = aesEnc.decrypt(record.infoDate, uId);
            record.infoDetails = aesEnc.decrypt(record.infoDetails, uId); 

            allRecords.push(record);
        }

        var recordsResponse = {
            count : allRecords.length,
            rows : allRecords
        }

        res.json(recordsResponse);
    });
}

module.exports.getThingDamage = exports.getThingDamage = function(req, res, uId, tId, uId, bId){
    
    fabricService.getThingDamageLog(tId, bId).then(function(damageRecords){

        //console.log(damageRecords);

        var allRecords = [];

        var n = damageRecords.length;
        for(var i = 0; i < n; i++){
            
            var record = damageRecords[i];

            record.recordedBy = aesEnc.decrypt(record.recordedBy, uId);
            record.totalWorkingUnits = aesEnc.decrypt(record.totalWorkingUnits, uId);
            record.totalWorkingUnitType = aesEnc.decrypt(record.totalWorkingUnitType, uId);
            record.damageDate = aesEnc.decrypt(record.damageDate, uId);
            record.damageDetails = aesEnc.decrypt(record.damageDetails, uId); 

            allRecords.push(record);
        }

        var recordsResponse = {
            count : allRecords.length,
            rows : allRecords
        }

        res.json(recordsResponse);
    });
}

module.exports.getThingRepair = exports.getThingRepair = function(req, res, uId, tId, uId, bId){
    
    fabricService.getThingRepairLog(tId, bId).then(function(repairRecords){

        //console.log(repairRecords);

        var allRecords = [];

        var n = repairRecords.length;
        for(var i = 0; i < n; i++){
            
            var record = repairRecords[i];

            record.recordedBy = aesEnc.decrypt(record.recordedBy, uId);
            record.totalWorkingUnits = aesEnc.decrypt(record.totalWorkingUnits, uId);
            record.totalWorkingUnitType = aesEnc.decrypt(record.totalWorkingUnitType, uId);
            record.repairDate = aesEnc.decrypt(record.repairDate, uId);
            record.repairEntity = aesEnc.decrypt(record.repairEntity, uId); 
            record.repairPrice = aesEnc.decrypt(record.repairPrice, uId); 
            record.repairPriceCurrency = aesEnc.decrypt(record.repairPriceCurrency, uId); 
            record.repairDetails = aesEnc.decrypt(record.repairDetails, uId); 

            allRecords.push(record);
        }

        var recordsResponse = {
            count : allRecords.length,
            rows : allRecords
        }

        res.json(recordsResponse);
    });
}

module.exports.getThingMaintenance = exports.getThingMaintenance = function(req, res, uId, tId, uId, bId){
    
    fabricService.getThingMaintenanceLog(tId, bId).then(function(maintananceRecords){

        //console.log(repairRecords);

        var allRecords = [];

        var n = maintananceRecords.length;
        for(var i = 0; i < n; i++){
            
            var record = maintananceRecords[i];

            record.recordedBy = aesEnc.decrypt(record.recordedBy, uId);
            record.totalWorkingUnits = aesEnc.decrypt(record.totalWorkingUnits, uId);
            record.totalWorkingUnitType = aesEnc.decrypt(record.totalWorkingUnitType, uId);
            record.maintenanceDate = aesEnc.decrypt(record.maintenanceDate, uId);
            record.maintenanceEntity = aesEnc.decrypt(record.maintenanceEntity, uId); 
            record.maintenancePrice = aesEnc.decrypt(record.maintenancePrice, uId); 
            record.maintenancePriceCurrency = aesEnc.decrypt(record.maintenancePriceCurrency, uId); 
            record.maintenanceDetails = aesEnc.decrypt(record.maintenanceDetails, uId); 

            allRecords.push(record);
        }

        var recordsResponse = {
            count : allRecords.length,
            rows : allRecords
        }

        res.json(recordsResponse);
    });
}

// create functions for history
module.exports.createBuyEvent = exports.createBuyEvent = function(req, res, uId, bId, newEvent){
    
    var newEventEnc = newEvent;
    
    newEventEnc.recordedBy = aesEnc.encrypt(newEvent.recordedBy, uId);
    newEventEnc.totalWorkingUnits = aesEnc.encrypt(newEvent.totalWorkingUnits, uId);
    newEventEnc.totalWorkingUnitType = aesEnc.encrypt(newEvent.totalWorkingUnitType, uId);
    newEventEnc.buyDate = aesEnc.encrypt(newEvent.buyDate, uId);
    newEventEnc.buyFrom = aesEnc.encrypt(newEvent.buyFrom, uId);
    newEventEnc.buyPrice = aesEnc.encrypt(newEvent.buyPrice, uId);
    newEventEnc.buyPriceCurrency = aesEnc.encrypt(newEvent.buyPriceCurrency, uId);
    newEventEnc.buyDetails = aesEnc.encrypt(newEvent.buyDetails, uId); 

    //console.log(newEventEnc);

    fabricService.createBuyEvent(newEventEnc, res);    
}

module.exports.createSaleEvent = exports.createSaleEvent = function(req, res, uId, bId, newEvent){
    
    var newEventEnc = newEvent;
    
    newEventEnc.recordedBy = aesEnc.encrypt(newEvent.recordedBy, uId);
    newEventEnc.totalWorkingUnits = aesEnc.encrypt(newEvent.totalWorkingUnits, uId);
    newEventEnc.totalWorkingUnitType = aesEnc.encrypt(newEvent.totalWorkingUnitType, uId);
    newEventEnc.saleDate = aesEnc.encrypt(newEvent.saleDate, uId);
    newEventEnc.saleDetails = aesEnc.encrypt(newEvent.saleDetails, uId); 

    //console.log(newEventEnc);

    fabricService.createSaleEvent(newEventEnc, res);    
}

module.exports.createInfoEvent = exports.createInfoEvent = function(req, res, uId, bId, newEvent){
    
    var newEventEnc = newEvent;
    
    newEventEnc.recordedBy = aesEnc.encrypt(newEvent.recordedBy, uId);
    newEventEnc.totalWorkingUnits = aesEnc.encrypt(newEvent.totalWorkingUnits, uId);
    newEventEnc.totalWorkingUnitType = aesEnc.encrypt(newEvent.totalWorkingUnitType, uId);
    newEventEnc.infoDetails = aesEnc.encrypt(newEvent.infoDetails, uId); 
    newEventEnc.infoDate = aesEnc.encrypt(newEvent.infoDate, uId); 

    //console.log(newEventEnc);

    fabricService.createInfoEvent(newEventEnc, res);    
}

module.exports.createDamageEvent = exports.createDamageEvent = function(req, res, uId, bId, newEvent){
    
    var newEventEnc = newEvent;
    
    newEventEnc.recordedBy = aesEnc.encrypt(newEvent.recordedBy, uId);
    newEventEnc.totalWorkingUnits = aesEnc.encrypt(newEvent.totalWorkingUnits, uId);
    newEventEnc.totalWorkingUnitType = aesEnc.encrypt(newEvent.totalWorkingUnitType, uId);
    newEventEnc.damageDetails = aesEnc.encrypt(newEvent.damageDetails, uId); 
    newEventEnc.damageDate = aesEnc.encrypt(newEvent.damageDate, uId); 

    //console.log(newEventEnc);

    fabricService.createDamageEvent(newEventEnc, res);    
}

module.exports.createRepairEvent = exports.createRepairEvent = function(req, res, uId, bId, newEvent){
    
    var newEventEnc = newEvent;
    
    newEventEnc.recordedBy = aesEnc.encrypt(newEvent.recordedBy, uId);
    newEventEnc.totalWorkingUnits = aesEnc.encrypt(newEvent.totalWorkingUnits, uId);
    newEventEnc.totalWorkingUnitType = aesEnc.encrypt(newEvent.totalWorkingUnitType, uId);
    newEventEnc.repairEntity = aesEnc.encrypt(newEvent.repairEntity, uId); 
    newEventEnc.repairPrice = aesEnc.encrypt(newEvent.repairPrice, uId); 
    newEventEnc.repairPriceCurrency = aesEnc.encrypt(newEvent.repairPriceCurrency, uId); 
    newEventEnc.repairDetails = aesEnc.encrypt(newEvent.repairDetails, uId); 
    newEventEnc.repairDate = aesEnc.encrypt(newEvent.repairDate, uId); 

    //console.log(newEventEnc);

    fabricService.createRepairEvent(newEventEnc, res);    
}

module.exports.createMaintenanceEvent = exports.createMaintenanceEvent = function(req, res, uId, bId, newEvent){
    
    var newEventEnc = newEvent;
    
    newEventEnc.recordedBy = aesEnc.encrypt(newEvent.recordedBy, uId);
    newEventEnc.totalWorkingUnits = aesEnc.encrypt(newEvent.totalWorkingUnits, uId);
    newEventEnc.totalWorkingUnitType = aesEnc.encrypt(newEvent.totalWorkingUnitType, uId);
    newEventEnc.maintenanceEntity = aesEnc.encrypt(newEvent.maintenanceEntity, uId); 
    newEventEnc.maintenancePrice = aesEnc.encrypt(newEvent.maintenancePrice, uId); 
    newEventEnc.maintenancePriceCurrency = aesEnc.encrypt(newEvent.maintenancePriceCurrency, uId); 
    newEventEnc.maintenanceDetails = aesEnc.encrypt(newEvent.maintenanceDetails, uId); 
    newEventEnc.maintenanceDate = aesEnc.encrypt(newEvent.maintenanceDate, uId); 

    //console.log(newEventEnc);

    fabricService.createMaintenanceEvent(newEventEnc, res);    
}
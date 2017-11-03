var uniqueString = require('unique-string');

var mongooseModels = require('./bitapel-mongoose-models');
var fabricService = require('./bitapel-fabric-service');
var aesEnc = require('./bitapel-encrypt');

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

module.exports.loginUser = exports.loginUser = function(req, res){
    
    var email = req.body.email;
    var password = req.body.password;
    console.log(email, password);

    mongooseModels.BitApelUser.find({}, function(err, users){
        
        if(err){
            res.json(err);
        }

        console.log(users);

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
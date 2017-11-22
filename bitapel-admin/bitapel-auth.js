module.exports.auth = exports.auth = function(req, res, next){
 
    var uId = req.params.uId;
    var bId = req.query.bId;

    let encryptor = require('simple-encryptor')(uId);
    var decryptedString = encryptor.decrypt(bId);

    //console.log(decryptedString, uId);

    function unauthorized(res) {
        res.status(500).send("Forbidden");
        return res.end();
    };

    if(decryptedString === uId){
        return next();
    }
    else{
        return unauthorized(res);
    }
}
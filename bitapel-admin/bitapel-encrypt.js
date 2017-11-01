module.exports.encrypt = exports.encrypt = function(text, password){
    let encryptor = require('simple-encryptor')(password);
    return encryptor.encrypt(text);
}

module.exports.decrypt = exports.decrypt = function (text, password){
    let encryptor = require('simple-encryptor')(password);
    return encryptor.decrypt(text);
}
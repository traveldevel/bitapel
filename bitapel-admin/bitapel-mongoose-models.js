
var mongoose = require('mongoose');

module.exports.BitApelUser = exports.BitApelUser = mongoose.model('Users', 
    { 
        firstName: String,
        lastName: String,
        email: String,
        password: String,
        createdAt: Date,
        markedForDeletion: Boolean,
        willBeDeletedOn: Date,
        emailIsConfirmed: Boolean,
        encryptedSuccesuful: Boolean
    }
);
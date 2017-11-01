require('dotenv').config();

const port = process.env.port || 8081;
const FABRIC_COMPOSER_REST_URL = process.env.FABRIC_COMPOSER_REST_URL;

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, { useMongoClient: true });
mongoose.Promise = global.Promise;

const uniqueString = require('unique-string');
const bcrypt = require('bcrypt');
var aes_enc = require('./bitapel-encrypt');
var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();

app.use(bodyParser.json());
app.use('/public-frontend', express.static('public-frontend'));
app.use('/admin-frontend', express.static('admin-frontend'));

// mongoose models

var BitApelUser = mongoose.model('Users', 
    { 
        firstName: String,
        lastName: String,
        email: String,
        password: String,
        createdAt: Date
    }
);

// redirect to public frontend
app.get('/', function (req, res) {
    res.redirect('/public-frontend/index.html');
});

// User api functions
app.post('/api/user/register', function (req, res) {
    
    var SECRET_KEY = uniqueString();

    var newUser = new BitApelUser({
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
            var savedId = savedNewUser._id.toString();
            var blockchainId = aes_enc.encrypt(savedId, savedId);
            
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

                    savedNewUser.firstName = aes_enc.encrypt(savedNewUser.firstName, savedId);
                    savedNewUser.lastName = aes_enc.encrypt(savedNewUser.lastName, savedId);
                    savedNewUser.email = aes_enc.encrypt(savedNewUser.email, savedId);
                    savedNewUser.password = bcrypt.hashSync(savedNewUser.password, 10);        

                    savedNewUser.save(function (err2, savedNewUser2) {
                        if (err2) {
                            res.json(err2);
                        } 
        
                        res.json(savedNewUser2);
                    });
                }                
            });
        }
    });
});

app.post('/api/user/login', function (req, res) {
    var user = {};
    res.json(user);
});

app.get('/api/user/:id', function (req, res) {
    var user = {};
    res.json(user);
});

// Thing api function
app.post('/api/thing/create', function (req, res) {
    var thing = {};
    res.json(thing);
});

app.post('/api/thing/update', function (req, res) {
    var thing = {};
    res.json(thing);
});

app.get('/api/thing/:id', function (req, res) {
    var thing = {};
    res.json(thing);
});

app.get('/api/thing/:id/transactions/:transactionType', function (req, res) {
    var list = [];
    res.json(list);
});

// Transaction api functions
app.post('/api/transaction/create', function (req, res) {
    var tran = {};
    res.json(tran);
});

app.get('/api/transaction/:id', function (req, res) {
    var tran = {};
    res.json(tran);
});

app.get('/api/thing/transactions/:thingId', function (req, res) {
    var list = [];
    res.json(list);
});

// app start
app.listen(port, function () {
    console.log('BitApel listening on ', port);
});
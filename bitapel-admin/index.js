
require('dotenv').config();

const port = process.env.port || 8081;

var fabricService = require('./bitapel-fabric-service');
var mongoService = require('./bitapel-mongo-service');
var bitapelService = require('./bitapel-service');

var bodyParser = require('body-parser');
var express = require('express');

var app = express();

app.use(bodyParser.json());
app.use('/public-frontend', express.static('public-frontend'));
app.use('/admin-frontend', express.static('admin-frontend'));

// redirect to public frontend
app.get('/', function (req, res) {
    res.redirect('/public-frontend/index.html');
});

// User api functions
app.post('/api/user/register', function (req, res) {
    bitapelService.registerUser(req, res);
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
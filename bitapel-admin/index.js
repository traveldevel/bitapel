
require('dotenv').config();

console.log("MongoDB :", process.env.MONGODB_URL);
console.log("Fabric API :", process.env.FABRIC_COMPOSER_REST_URL);

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
    bitapelService.loginUser(req, res);
});

app.get('/api/user/which/:id', function (req, res) {
    var id = req.params.id;
    bitapelService.whichUser(req, res, id);
});

app.get('/api/user/menu', function (req, res) {
    var id = req.query.id;
    bitapelService.getThingsForUser(req, res, id);
});

app.get('/api/user/alerts/:id', function (req, res) {
    var id = req.params.id;

    var alerts = {
        "alerts":
            {
                "notifications": [
                    {
                        "title": "New Order",
                        "description": "John Max has ordered Laptop",
                        "date": "1 hour ago",
                        "priority": "High",
                        "icon": "sap-icon://clinical-order"
                    },
                    {
                        "title": "Canceled Order",
                        "description": "Sara Rok has canceled her order",
                        "date": "5 hour ago",
                        "priority": "Medium",
                        "icon": "sap-icon://sys-cancel-2"
                    },
                    {
                        "title": "Delivery",
                        "description": "Order 112 has delivered to nancy klaus",
                        "date": "2 day ago",
                        "priority": "Low",
                        "icon": "sap-icon://message-success"
                    }
                ],
                "errors": [
                    {
                        "title": "Password Error",
                        "subTitle": "invalid password",
                        "description": "User S700 exceeded number of tries to enter password",
                        "counter": 1
                    }
                ]
            }
    
    };

    res.json(alerts);
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
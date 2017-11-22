
require('dotenv').config();

console.log("MongoDB :", process.env.MONGODB_URL);
console.log("Fabric API :", process.env.FABRIC_COMPOSER_REST_URL);

const port = process.env.port || 8081;

var fabricService = require('./bitapel-fabric-service');
var mongoService = require('./bitapel-mongo-service');
var bitapelService = require('./bitapel-service');
var auth = require('./bitapel-auth').auth;

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

app.get('/api/user/which/:uId', function (req, res) {
    var uId = req.params.uId;
    bitapelService.whichUser(req, res, uId);
});

app.get('/api/user/menu/:uId', auth, function (req, res) {
    var bId = req.query.bId;
    var uId = req.params.uId;
    bitapelService.getThingsForUserMenu(req, res, bId, uId);
});

app.get('/api/user/alerts/:uId', auth, function (req, res) {
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

app.get('/api/user/:uId', auth, function (req, res) {
    var bId = req.query.bId;
    var uId = req.params.uId;
    mongoService.getUserById(req, res, uId);
});

app.put('/api/user/update/:uId', auth, function (req, res) {
    var uId = req.params.uId;
    var saveUser = req.body;
    mongoService.updateUser(req, res, uId, saveUser);
});

// Thing api function
app.post('/api/thing/create/:uId', auth, function (req, res) {
    var uId = req.params.uId;
    var newThing = req.body;
    bitapelService.createThing(req, res, uId, newThing);
});

app.put('/api/thing/update/:uId', auth, function (req, res) {
    var uId = req.params.uId;
    var saveThing = req.body;
    bitapelService.saveThing(req, res, uId, saveThing);
});

app.get('/api/thing/:uId/:tId', auth, function (req, res) {
    var bId = req.query.bId;
    var uId = req.params.uId;
    var tId = req.params.tId;
    bitapelService.getThing(req, res, uId, bId, tId);
});

app.get('/api/things/:uId', auth, function (req, res) {
    var bId = req.query.bId;
    var uId = req.params.uId;
    bitapelService.getAllThings(req, res, uId, bId);
});

// Transaction create api functions
app.post('/api/event/buy/create/:tId/:uId', auth, function (req, res) {
    var bId = req.query.bId;
    var tId = req.params.tId;    
    var uId = req.params.uId;
    var newEvent = req.body;
    bitapelService.createBuyEvent(req, res, uId, bId, newEvent);
});

app.post('/api/event/sale/create/:tId/:uId', auth, function (req, res) {
    var bId = req.query.bId;
    var tId = req.params.tId;    
    var uId = req.params.uId;
    var newEvent = req.body;
    bitapelService.createSaleEvent(req, res, uId, bId, newEvent);
});

app.post('/api/event/info/create/:tId/:uId', auth, function (req, res) {
    var bId = req.query.bId;
    var tId = req.params.tId;    
    var uId = req.params.uId;
    var newEvent = req.body;
    bitapelService.createInfoEvent(req, res, uId, bId, newEvent);
});

app.post('/api/event/damage/create/:tId/:uId', auth, function (req, res) {
    var bId = req.query.bId;
    var tId = req.params.tId;    
    var uId = req.params.uId;
    var newEvent = req.body;
    bitapelService.createDamageEvent(req, res, uId, bId, newEvent);
});

app.post('/api/event/repair/create/:tId/:uId', auth, function (req, res) {
    var bId = req.query.bId;
    var tId = req.params.tId;    
    var uId = req.params.uId;
    var newEvent = req.body;
    bitapelService.createRepairEvent(req, res, uId, bId, newEvent);
});

app.post('/api/event/maintenance/create/:tId/:uId', auth, function (req, res) {
    var bId = req.query.bId;
    var tId = req.params.tId;    
    var uId = req.params.uId;
    var newEvent = req.body;
    bitapelService.createMaintenanceEvent(req, res, uId, bId, newEvent);
});

// Transaction get
app.get('/api/events/buyandsale/:tId/:uId', auth, function (req, res) {
    var bId = req.query.bId;
    var tId = req.params.tId;    
    var uId = req.params.uId;
    bitapelService.getThingBuyAndSell(req, res, uId, tId, uId, bId);
});

app.get('/api/events/info/:tId/:uId', auth, function (req, res) {
    var bId = req.query.bId;
    var tId = req.params.tId;    
    var uId = req.params.uId;
    bitapelService.getThingInfo(req, res, uId, tId, uId, bId);
});

app.get('/api/events/damage/:tId/:uId', auth, function (req, res) {
    var bId = req.query.bId;
    var tId = req.params.tId;    
    var uId = req.params.uId;
    bitapelService.getThingDamage(req, res, uId, tId, uId, bId);
});

app.get('/api/events/repair/:tId/:uId', auth, function (req, res) {
    var bId = req.query.bId;
    var tId = req.params.tId;    
    var uId = req.params.uId;
    bitapelService.getThingRepair(req, res, uId, tId, uId, bId);
});

app.get('/api/events/maintenance/:tId/:uId', auth, function (req, res) {
    var bId = req.query.bId;
    var tId = req.params.tId;    
    var uId = req.params.uId;
    bitapelService.getThingMaintenance(req, res, uId, tId, uId, bId);
});

// app start
app.listen(port, function () {
    console.log('BitApel listening on ', port);
});
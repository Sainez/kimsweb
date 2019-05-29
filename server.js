// ------------ Global ----------------
var http = require('http');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var app = express();
var server = http.createServer(app);
var socketIO = require('socket.io');
var io = socketIO.listen(server);
var cors = require('cors');

//global variables
app.locals = {
    // Super User.. Only used for demonstration 
    // Should be removed on real implementation   
    superClinician : [ { firstName : "Sainez", surname : "Amon", lastName : "Kimutai", username : "@sainez_sainez", userNo : "000002", nationalId : "00000000", gender : "male", phone : "+254 718 896 779", specialize : "SuperUser", profNo : "101010", mail : "sainez@kimsweb.co.ke", password : '573fcc62ae45988da88a492d0e15b5c01c53cc94f5a1d7aed95bb1208a8862f6e57164f42b98d7f8dbe8f989d24f7476e351b955a29d77af77a74cd677ce9bbc' } ], // Clinical Users
    superAdmin : [ { firstName : "Sainez", surname : "Amon", lastName : "Kimutai", username : "@sainez_sainez", userNo : "000001",  nationalId : "00000000", gender : "male", phone : "+254 718 896 779", department : "SuperUser", officeNo : "101010", mail : "sainez@kimsweb.co.ke", password : '573fcc62ae45988da88a492d0e15b5c01c53cc94f5a1d7aed95bb1208a8862f6e57164f42b98d7f8dbe8f989d24f7476e351b955a29d77af77a74cd677ce9bbc' } ], // Admin Users
    
    // Active files variables
    activeONE : [], activeTWO : [], activeTHREE : [], activeFOUR : [],activeMED : [], activeUSER : []
};

// Database Config
var db = require('./config/keys').MongoURI;

// Connect to Mongo 
mongoose.connect(db, { useNewUrlParser: true } )
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log("Cannot connect to MongoDB!!"));

// Passport Config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Controlers
var users = require('./controllers/users.js');
var files = require('./controllers/files.js');
var stats = require('./controllers/stats.js');

// controllers
users(app);
files(app, io);
stats(app, io);

//Static files
app.use(express.static(path.join(__dirname, '/public')));

//cors
app.use(cors({
    credentials : true
}));

//Get all Routes
app.get('/*', cors(), function(req, res){
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

//Socket Connection
io.on('connection', function(){});

//listen to port
server.listen(process.env.PORT || 8090, () =>{
    console.log('Running Port 8090....');
});



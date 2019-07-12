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
server.listen(process.env.PORT || 8040, () =>{
    console.log('Running Port 8040....');
});



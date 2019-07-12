var cors = require('cors');
var bodyParser = require('body-parser');
var passport = require('passport');
var urlencodedParser = bodyParser.urlencoded({extended: true});
var jwt = require('jsonwebtoken');
'use strict';
var crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;


// Load Models
var ClinicianUser = require('../models/User').ClinicianUser;
var AdminUser = require('../models/User').AdminUser;

// ============================================//

module.exports = function(app){

    app.use(cors({
        credentials : true
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));
    var secret = 'thenewsheriff'; 


//=== Check Password ===
var checkPassword = function(password){
    var salt = 'da7b43055355d7ac362188d88330c79d';
    var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');   
    return hash;
};

//------------------- Clinician Registration --------------------------------------
app.post('/regclinician', urlencodedParser, function(req, res){ 

    
    ClinicianUser.findOne({ mail : req.body.mail })
    .then(user => {
        if (user) {
            res.status(401).send("Email Already Exist !");
        }else{
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                if (err) throw err;

                req.body.password = hash;
                req.body.userNo = crypto.randomBytes(3).toString('hex');
                ClinicianUser(req.body).save().then(user => {
                    res.json(user);
                }).catch(err => console.log(err));
              });
             

            
        }
    })

});

//------------------------Clinician Login--------------------------------------
app.post('/logclinician', cors(), urlencodedParser, function(req, res, next){

    if (req.body){
   
    var user = new Array;
    user.mail = req.body.mail;
    
    user.password = checkPassword(req.body.password);

            //passport
            passport.authenticate('clinician-local', (err, user, info) => {

                if (err) {
                   res.status(401).json(err);
                   
                }
                if (user) {
                   var token = jwt.sign({
                       mail : user.mail, mail : user.mail ,pass: user.password},
                       secret, {expiresIn : 604800});
                   var signedUser = user.firstName + ' ' + user.surname + ' ' + user.lastName;
                  
                   res.status(200).json({
                              signedUser : signedUser,
                              token : token
                              })	
                }
                else{
                   res.status(401).json(info.message);
                }
            }) ( req, res, next);


}


});

//----------------- Admin Registration -----------------------------//
app.post('/regadmin', cors(), urlencodedParser, function(req, res){

    AdminUser.findOne({ mail : req.body.mail })
    .then(user => {
        if (user) {
            res.status(401).send("Email Already Exist !");
        }else{
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                if (err) throw err;

                req.body.password = hash;
                req.body.userNo = crypto.randomBytes(3).toString('hex');
                AdminUser(req.body).save().then(user => {
                    res.json(user);
                }).catch(err => console.log(err));
              });
        }
    })

});


//----------------- Admin Login -----------------------------//
app.post('/logadmin', cors(), urlencodedParser, function( req, res, next){

    if (req.body){ 

        var user = new Array;
        user.mail = req.body.mail;  
              
        user.password = checkPassword(req.body.password);

        // Passport
        passport.authenticate('admin-local', (err, user, info) => {

            if (err) {
                res.status(401).send(err);
                
            }
            if (user) {
                var token = jwt.sign({
                    mail : user.mail, mail : user.mail ,pass: user.password},
                    secret, {expiresIn : 604800});
                var signedUser = user.firstName + ' ' + user.surname + ' ' + user.lastName;
                
                res.status(200).send({
                            signedUser : signedUser,
                            token : token
                            })	
            }
            else{
                res.status(401).send(info.message);
            }
        }) ( req, res, next);
    
    } 

});




//----------------------------------------------//

};

//=============================================//
// Imports
var cors = require('cors');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true});


// Load Models
var ClinicianUser = require('../models/User').ClinicianUser;
var AdminUser = require('../models/User').AdminUser;
var AtAdmissionFiles = require('../models/File').AtAdmissionFiles;
var ToLabFiles = require('../models/File').ToLabFiles;
var FromLabFiles = require('../models/File').FromLabFiles;
var ToXrayFiles = require('../models/File').ToXrayFiles;
var FromXrayFiles = require('../models/File').FromXrayFiles;
var ToPharmacyFiles = require('../models/File').ToPharmacyFiles;
var SavedFiles = require('../models/File').SavedFiles;


// ============================================//

module.exports = function(app, io){
    app.use(cors({
        credentials : true
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));
   
    // variables
    var activeMED = app.locals.activeMED;
    var activeUSER = app.locals.activeUSER;
    

    
// Monitor
setInterval(() =>{

    AtAdmissionFiles.find({}).then( admFiles =>{

        ToLabFiles.find({}).then( tolabFiles =>{

            FromLabFiles.find({}).then( fromlabFiles =>{

                ToXrayFiles.find({}).then( toxrayFiles =>{

                    FromXrayFiles.find({}).then( fromxrayFiles =>{

                        ToPharmacyFiles.find({}).then( topharmacyFiles =>{

                            SavedFiles.find({}).then( savedFiles =>{

                                io.emit('/monitor',{
                                    fromAdm     : admFiles.length,
                                    toLab       : tolabFiles.length,
                                    fromLab     : fromlabFiles.length,
                                    toXray      : toxrayFiles.length,
                                    fromXray    : fromxrayFiles.length,
                                    toPharmacy  : topharmacyFiles.length,
                                    archived    : savedFiles.length
                                });

                            }).catch(err => console.log(err));

                        }).catch(err => console.log(err));

                    }).catch(err => console.log(err));

                }).catch(err => console.log(err));

            }).catch(err => console.log(err));

        }).catch(err => console.log(err));

    }).catch(err => console.log(err));

}, 700);




    


// Medical Database
setInterval(() =>{

    SavedFiles.find({}).then( savedFiles =>{

        io.emit('/medicaldb',{
            archivednumber  : savedFiles.length,
            archivedfiles   : savedFiles
        });

    }).catch(err => console.log(err));

    

}, 700);

//====== Opening medical file =======
app.post('/openmedical', cors(), urlencodedParser, function(req, res){
        
    activeMED = activeMED.filter(function(){
        return false;
    });   

    SavedFiles.findOne({ patientNo : req.body.patientNo }).then( file => {

        req.body.name = file.name;
        req.body.patientNo = file.patientNo;
        req.body.age = file.age;
        req.body.gender = file.gender;
        req.body.signs = file.signs;
        req.body.tests = file.tests;
        req.body.results = file.results;
        req.body.dx = file.dx;

        activeMED.push(req.body);             
        res.json(activeMED);

    }).catch(err => console.log(err));           
   
});  


// Med oN reload
app.delete('/medonreload', cors(), function(req, res){
       
    activeMED = activeMED.filter(function(){
        return false;
    });

});


// Delete Medical
app.delete('/deletemedical', cors(), function(req, res){

    SavedFiles.deleteOne({ patientNo : activeMED[0].patientNo }).then( file => {

        activeMED = activeMED.filter(function(){
            return false;
        });

        res.json(file);

    }).catch(err => console.log(err));

});






//// ========================== User Stats ===================================

// User Database

setInterval(() =>{

    ClinicianUser.find({})
    .then(cliUser => {

        AdminUser.find({})
        .then(admUser =>{

            io.emit('/userdb',{
                clinician           : cliUser.length,
                admin               : admUser.length,
                clinicianprofiles   : cliUser,
                adminprofiles       : admUser
            });

        })
        .catch(err => console.log(err));

    })
    .catch(err => console.log(err));



}, 700);   








//====== Opening Clinician Profile =======
app.post('/openuserclinician', cors(), urlencodedParser, function(req, res){
        
    activeUSER = activeUSER.filter(function(){
        return false;
    });

    ClinicianUser.findOne({userNo : req.body.userNo})
        .then(user =>{

            req.body.name = user.firstName + ' ' + user.surname + ' ' + user.lastName;
            req.body.userNo = user.userNo;
            req.body.nationalId = user.nationalId;
            req.body.gender = user.gender;
            req.body.phone = user.phone;
            req.body.specialize = user.specialize;
            req.body.profNo = user.profNo;
            req.body.mail = user.mail;

            activeUSER.push(req.body);             
            res.json(activeUSER);

        })
        .catch(err => console.log(err));
   
});     


//====== Opening Admin Profile =======
app.post('/openuseradmin', cors(), urlencodedParser, function(req, res){
        
    activeUSER = activeUSER.filter(function(){
        return false;
    });
    
    AdminUser.findOne({userNo : req.body.userNo})
        .then(user =>{

            req.body.name = user.firstName + ' ' + user.surname + ' ' + user.lastName;
            req.body.userNo = user.userNo;
            req.body.nationalId = user.nationalId;
            req.body.gender = user.gender;
            req.body.phone = user.phone;
            req.body.specialize = user.specialize;
            req.body.profNo = user.profNo;
            req.body.mail = user.mail;

            activeUSER.push(req.body);             
            res.json(activeUSER);

        })
        .catch(err => console.log(err));
   
});  


// User on reload
app.delete('/useronreload', cors(), function(req, res){
       
    activeUSER = activeUSER.filter(function(){
        return false;
    });

});


// Delete Clinician
app.delete('/deleteusercli', cors(), function(req, res){

    ClinicianUser.deleteOne({userNo : activeUSER[0].userNo})
        .then( data => {    
                activeUSER = activeUSER.filter(function(){
                    return false;
                });
    
                res.json(data);

        })
        .catch(err => console.log(err));

});

// delete Admin
app.delete('/deleteuseradm', cors(), function(req, res){

    AdminUser.deleteOne({userNo : activeUSER[0].userNo})
        .then( data => {      
                activeUSER = activeUSER.filter(function(){
                    return false;
                });
    
                res.json(data);
        })
        .catch(err => console.log(err));

});





//----------------------------------------------//

};

//=============================================//
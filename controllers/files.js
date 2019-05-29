// imports
var cors = require('cors');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true});
'use strict';
var crypto = require('crypto');

// Load Models
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
    var activeONE = app.locals.activeONE;
    var activeTWO = app.locals.activeTWO;
    var activeTHREE = app.locals.activeTHREE;
    var activeFOUR = app.locals.activeFOUR;


// Update All Lists

setInterval(() =>{

    // Admission
    AtAdmissionFiles.find({}).then(files =>{io.emit('/admission', files);}).catch(err => console.log(err));

    // Laboratory
    ToLabFiles.find({}).then(files =>{io.emit('/listtolab', files);}).catch(err => console.log(err));

    // Exam from Lab
    FromLabFiles.find({}).then(files =>{io.emit('/listfromlab', files);}).catch(err => console.log(err));

    // Xray
    ToXrayFiles.find({}).then(files =>{io.emit('/listtoxray', files);}).catch(err => console.log(err));

    // Exam from Xray
    FromXrayFiles.find({}).then(files =>{io.emit('/listfromxray', files);}).catch(err => console.log(err));

    // Pharmacy
    ToPharmacyFiles.find({}).then(files =>{io.emit('/listpharmacy', files);}).catch(err => console.log(err));

}, 700);


// Admission Patient
    app.post('/admission', cors(), urlencodedParser, function(req, res){
        req.body.patientNo = crypto.randomBytes(5).toString('hex');

        AtAdmissionFiles(req.body).save().then(files =>{
            res.json(files);
        }).catch(err => console.log(err));
        
         
    }); 




//====== Opening PatientFile from Admission =======
    app.post('/openadmissionfile', cors(), urlencodedParser, function(req, res){
        if (activeONE[0] == null ) {
      
            AtAdmissionFiles.findOne({ patientNo : req.body.patientNo })
            .then(file =>{
                    req.body.name = file.firstName + ' ' + file.lastName;
                    req.body.patientNo = file.patientNo;
                    req.body.age = file.age;
                    req.body.gender = file.gender;

                    activeONE.push(req.body);             
                    res.json(activeONE);
                    io.emit('/updateexamform', activeONE);

            }).catch(err => console.log(err));          
                      
        } else{
            res.status(403).send('Another file is already Open !');
        }
    });     

   

// ==== On Examination Reload =========

app.delete('/examinationreload', cors(), function(req, res){
       
    activeONE = activeONE.filter(function(){
        return false;
    });
    io.emit('/updateexamform', activeONE);

});

//======= Delete File =========

app.delete('/deletefile', cors(), function(req, res){

    AtAdmissionFiles.deleteOne({ patientNo : activeONE[0].patientNo })
    .then( file => {
        activeONE = activeONE.filter(function(){
            return false;
        });

        res.json(file);
        io.emit('/updateexamform', activeONE);

    }).catch(err => console.log(err));       

});


//======= To Lab =========

app.post('/tolab', cors(), function(req, res){

    req.body.name = activeONE[0].name;
    req.body.patientNo = activeONE[0].patientNo;
    req.body.age = activeONE[0].age;
    req.body.gender = activeONE[0].gender;

    ToLabFiles(req.body).save().then( data => {

        AtAdmissionFiles.deleteOne({ patientNo : activeONE[0].patientNo }).then( file => {

            activeONE = activeONE.filter(function(){
                return false;
            });

            res.json(data);
            io.emit('/updateexamform', activeONE);

        }).catch(err => console.log(err));

    }).catch(err => console.log(err));    

});



//====== Opening lab files from Exam =======
app.post('/openlabfile', cors(), urlencodedParser, function(req, res){
    if (activeTWO[0] == null ) {
  
        ToLabFiles.findOne({ patientNo : req.body.patientNo })
        .then( file =>{

            activeTWO.push(file);
            res.json(activeTWO);
            io.emit('/updatelabform', activeTWO);
            
        }).catch(err => console.log(err));
           
    } else{
        res.status(403).send('Another file is already Open !');
    }
});  


// ==== On Lab Reload =========

app.delete('/labreload', cors(), function(req, res){
       
    activeTWO = activeTWO.filter(function(){
        return false;
    });
    io.emit('/updatelabform', activeTWO);

});

//======= From Lab To Exam =========

app.post('/labtoexam', cors(), function(req, res){

    req.body.name = activeTWO[0].name;
    req.body.patientNo = activeTWO[0].patientNo;
    req.body.age = activeTWO[0].age;
    req.body.gender = activeTWO[0].gender;
    req.body.signs = activeTWO[0].signs;
    req.body.tests = activeTWO[0].tests;

    FromLabFiles(req.body).save().then(data =>{

        ToLabFiles.deleteOne({ patientNo : activeTWO[0].patientNo }).then( file => {

            activeTWO = activeTWO.filter(function(){
                return false;
            });
            res.json(data);
            io.emit('/updatelabform', activeTWO);

        }).catch(err => console.log(err));

    }).catch(err => console.log(err));

});


//====== Opening files from Lab =======
app.post('/openfilefromlab', cors(), urlencodedParser, function(req, res){
    if (activeONE[0] == null ) {
  
        FromLabFiles.findOne({ patientNo : req.body.patientNo }).then( file => {

            activeONE.push(file);             
            res.json(activeONE);
            io.emit('/updateexamform', activeONE);

        }).catch(err => console.log(err));
                   
    } else{
        res.status(403).send('Another file is already Open !');
    }
});  
















//======= To Xray =========
app.post('/toxray', cors(), function(req, res){

    req.body.name = activeONE[0].name;
    req.body.patientNo = activeONE[0].patientNo;
    req.body.age = activeONE[0].age;
    req.body.gender = activeONE[0].gender;

    ToXrayFiles(req.body).save().then(data => {

        AtAdmissionFiles.deleteOne({ patientNo : activeONE[0].patientNo }).then( file =>{

            activeONE = activeONE.filter(function(){
                return false;
            });
            res.json(data);
            io.emit('/updateexamform', activeONE);

        }).catch(err => console.log(err));
        

    }).catch(err => console.log(err));

});

//====== Opening Xray files from Exam =======
app.post('/openxrayfile', cors(), urlencodedParser, function(req, res){
    if (activeTHREE[0] == null ) {
  
        ToXrayFiles.findOne({ patientNo : req.body.patientNo }).then( file =>{

            activeTHREE.push(file);             
            res.json(activeTHREE);
            io.emit('/updatexrayform', activeTHREE);

        }).catch(err => console.log(err));
                    
    } else{
        res.status(403).send('Another file is already Open !');
    }
});  


// ==== On Xray Reload =========

app.delete('/xrayreload', cors(), function(req, res){
       
    activeTHREE = activeTHREE.filter(function(){
        return false;
    });
    io.emit('/updatexrayform', activeTHREE);

});

//======= From Xray To Exam =========

app.post('/xraytoexam', cors(), function(req, res){

    req.body.name = activeTHREE[0].name;
    req.body.patientNo = activeTHREE[0].patientNo;
    req.body.age = activeTHREE[0].age;
    req.body.gender = activeTHREE[0].gender;
    req.body.signs = activeTHREE[0].signs;
    req.body.tests = activeTHREE[0].tests;

    FromXrayFiles(req.body).save().then( data => {

        ToXrayFiles.deleteOne({ patientNo : activeTHREE[0].patientNo }).then( file => {

            activeTHREE = activeTHREE.filter(function(){
                return false;
            });
            res.json(data);
            io.emit('/updatexrayform', activeTHREE);

        }).catch(err => console.log(err));

    }).catch(err => console.log(err));    

});



//====== Opening files from Xray =======
app.post('/openfilefromxray', cors(), urlencodedParser, function(req, res){
    if (activeONE[0] == null ) {
  
        FromXrayFiles.findOne({ patientNo : req.body.patientNo }).then( file => {

            activeONE.push(file);             
            res.json(activeONE);
            io.emit('/updateexamform', activeONE);

        }).catch(err => console.log(err));
           
    } else{
        res.status(403).send('Another file is already Open !');
    }
});  




















//======= To pharmacy =========
app.post('/topharmacy', cors(), function(req, res){

    req.body.name = activeONE[0].name;
    req.body.patientNo = activeONE[0].patientNo;
    req.body.age = activeONE[0].age;
    req.body.gender = activeONE[0].gender;

    ToPharmacyFiles(req.body).save().then( data => {

        AtAdmissionFiles.deleteOne({ patientNo : activeONE[0].patientNo }).then( file => {

            activeONE = activeONE.filter(function(){
                return false;
            });
            res.json(data);
            io.emit('/updateexamform', activeONE);

        }).catch(err => console.log(err));

    }).catch(err => console.log(err));
            
});


//======= To pharm =========
app.post('/topharm', cors(), function(req, res){

    req.body.name = activeONE[0].name;
    req.body.patientNo = activeONE[0].patientNo;
    req.body.age = activeONE[0].age;
    req.body.gender = activeONE[0].gender;
    req.body.signs = activeONE[0].signs;
    req.body.tests = activeONE[0].tests;
    req.body.results = activeONE[0].results;
    
    // Saves pharmacy file
    ToPharmacyFiles(req.body).save().then( data => {

        // check if it originates from lab
        FromLabFiles.findOne({ patientNo : activeONE[0].patientNo }).then( file =>{

            // if no, it means its from xray
            if (!file){

                FromXrayFiles.deleteOne({ patientNo : activeONE[0].patientNo }).then( file => {

                    activeONE = activeONE.filter(function(){
                        return false;
                    });
                    res.json(data);
                    io.emit('/updateexamform', activeONE);
        
                }).catch(err => console.log(err));
            }

            // if yes... deletes it
            FromLabFiles.deleteOne({ patientNo : activeONE[0].patientNo }).then( file => {

                activeONE = activeONE.filter(function(){
                    return false;
                });
                res.json(data);
                io.emit('/updateexamform', activeONE);
    
            }).catch(err => console.log(err));

        }).catch(err => console.log(err));

    }).catch(err => console.log(err));    
          
});


//====== Opening Pharmacy File =======
app.post('/openpharmacyfile', cors(), urlencodedParser, function(req, res){
    if (activeFOUR[0] == null ) {
  
        ToPharmacyFiles.findOne({ patientNo : req.body.patientNo }).then( file => {

            activeFOUR.push(file);             
            res.json(activeFOUR);
            io.emit('/updatepharmacyform', activeFOUR);

        }).catch(err => console.log(err));
           
    } else{
        res.status(403).send('Another file is already Open !');
    }
});  


// ==== On Pharmacy Reload =========

app.delete('/pharmacyreload', cors(), function(req, res){
       
    activeFOUR = activeFOUR.filter(function(){
        return false;
    });
    io.emit('/updatepharmacyform', activeFOUR);;

});

//======= Save File =========

app.post('/savefile', cors(), function(req, res){

    req.body.name = activeFOUR[0].name;
    req.body.patientNo = activeFOUR[0].patientNo;
    req.body.age = activeFOUR[0].age;
    req.body.gender = activeFOUR[0].gender;
    req.body.signs = activeFOUR[0].signs;
    req.body.tests = activeFOUR[0].tests;
    req.body.results = activeFOUR[0].results;
    req.body.dx = activeFOUR[0].dx;

    SavedFiles(req.body).save().then( data => {

        ToPharmacyFiles.deleteOne({ patientNo : activeFOUR[0].patientNo }).then( file => {

            activeFOUR = activeFOUR.filter(function(){
                return false;
            });

            res.json(data);
            io.emit('/updatepharmacyform', activeFOUR);

        })

    }).catch(err => console.log(err));

});









//----------------------------------------------//

};

//=============================================//
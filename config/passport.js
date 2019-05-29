var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

//Load Models
var ClinicianUser = require('../models/User').ClinicianUser;
var AdminUser = require('../models/User').AdminUser;

module.exports = function(passport) {

    // Clinician Passport
    passport.use('clinician-local',

        new LocalStrategy({ usernameField : 'mail' }, (mail, password, done) => {

            //Match Clinician User
            ClinicianUser.findOne( { mail : mail })
                .then(user => {
                        if(!user) {
                            return done(null, false, { message : 'That Email is not registered !!' } );
                        }                        

                        //Match Clinician Password
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        }
                        else{
                            return done(null, false, { message : "Password Incorrect" } );
                        }
                    });    

                   
                })
                .catch(err => console.log(err));

        })

    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        ClinicianUser.findById(id, (err, user) => {
            done(err, user);
        });
    });


// Admin Passport 

passport.use('admin-local',

    new LocalStrategy({ usernameField : 'mail' }, (mail, password, done) => {

        //Match Clinician User
        AdminUser.findOne( { mail : mail })
            .then(user => {
                    if(!user) {
                        return done(null, false, { message : 'That Email is not registered !!' } );
                    }                        

                    //Match Clinician Password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                        return done(null, user);
                    }
                    else{
                        return done(null, false, { message : "Password Incorrect" } );
                    }
                });    

               
            })
            .catch(err => console.log(err));

    })

);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    AdminUser.findById(id, (err, user) => {
        done(err, user);
    });
});



}
//config/passport.js

//load all the things we need

var LocalStrategy    =  require('passport-local').Strategy;

// load up the user model

var User             =  require('../app/models/user');

//expose this function to our app using module.exports
module.exports = function(passport) {

    //passport signup
    //for persistent login
    //passport needs ability to serialize and unserialize

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    //used to deserialize the user
    passport.deserializeUser(function(id, done) {
       User.findById(id, function(error, user) {
            done(error, user);
      });
    });


    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy username and password, we will override
        usernameField : 'email', 
        passwordField : 'password',
        passReqToCallback : true
   },
   

  function(req, email, password, done) {
    //asynchr
    //userfindone wont fire unless data is sent back
    process.nextTick(function() {
    //find a user whose email is the same as the forms emaill
    User.findOne({'local.email' : email }, function(error, user) {
         if (error) return done(error); //if there are errors return erros
         if (user) { return done(null, false, req.flash('signupMessage', 'That email is already taken.')); }
         else {
         
         //if there is no user with that email
         //create the user
         var newUser = new User();
         
         newUser.local.email  = email;
         newUser.local.password = newUser.generateHash(password);
         newUser.local.posts = 0;
         newUser.local.upvotes = 0;
        //save the user
        newUser.save(function(error) {
           if (error) throw error;
           return done(null, newUser);
        });
        }
     });
     });
     }));
     //}; 

passport.use('local-login', new LocalStrategy({
   // by default, local strategy uses username and password, override with email
   usernameField: 'email',
   passwordField: 'password',
   passReqToCallback : true //allows us to pass back entire request to a callback
  },
  function(req, email, password, done) { //callback with email and password from our form
  //find matching emails
  User.findOne({'local.email' : email }, function( error, user) {
  // if there are any errors, return the error before anything else
  if(error) return done(error);
  //if no user is found, return the message
  if(!user)
     return done(null, false, req.flash('loginMessage', 'No user found.'));
  if(!user.validPassword(password))
     return done(null, false, req.flash('loginMessage', 'Oops! Wrong Password.'));

  //if everythings ok
  return done(null, user);
 });
 
}));



};

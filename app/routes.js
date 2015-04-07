

module.exports = function(app, passport) {
     //homepage
     var mongoose = require('mongoose');
     require('../app/models/comments.js');
     require('../app/models/posts.js');
     var Post = mongoose.model('Post');
     var Comment = mongoose.model('Comment');

     app.get('/', function(req, res) {
         res.render('index.ejs'); //load the index.ejs file
         });


     //login form
     app.get('/login', function(req, res) {
         //render the page and pass in any flash data if it exists
         res.render('login.ejs', { message: req.flash('loginMessage')});
     });
   
    //process the login form 
    //app/post ('/login', do all our passport stuff here)
     app.post('/login', passport.authenticate('local-login', {
         successRedirect : '/profile', //redirect to the secure profile section
         failureRedirect : '/login', //redirect back to the signup page
         failureFlash : true //allow flash messages
     }));
   //Signup


   app.get('/signup', function(req, res) {
     //render the page and pass inany flash data
     res.render('signup.ejs', { message: req.flash('signupMessage')});
   });
  
   //proces the signup form
   //app.post('/signup', do all our passport stuff here')
   app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', //redirect to profile
        failureRedirect : '/signup' , //redirect back to the signup page
        failureFlash : true //allow flash messages
   }));
   //profile section
   app.get('/profile', isLoggedIn, function(req, res) {
       res.render('profile.ejs', {
           user : req.user  //get the user out of session and pass to template
       });
   });

   //Logout
   app.get('/logout', function(req, res) {
       req.logout();
       res.redirect('/');
   });

//==================

 app.get('/posts', function(req, res, next) {
     Post.find(function(err, posts){
       if(err) { return next(err); }
       res.json(posts);
       });
   });



   app.post('/posts', function(req, res, next) {
       var post = new Post(req.body);
       post.save(function(error, post) {
           if(error) { return next(error); }
           res.json(post);
       });
});


//calling before the route, faster loading?
   app.param('post', function(req,res,next, id) {
     var query = Post.findById(id);
    
     query.exec(function(error, post){
     if(error) { return next(error); }
     if(!post) { return next(new Error('Can\'t find post')); }
     req.post = post;
     return next();
   });
  });

//our route for returning a single post
app.get('/posts/:post', function(request, response) {
    response.json(request.post);
});

app.put('/posts/:post/upvote', function(req,res,next) {
    req.post.upvote(function(err,post) {
        if (err) { return next(err); }
        res.json(post);
    });
});
 
  
//=================  

};
//route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
   //if user is authenticated in the session, carry on
   if (req.isAuthenticated())
      return next(); //cuz we want to move on incase we're stuck here

   //if they arent redirect them to the home page
   res.redirect('/');
}



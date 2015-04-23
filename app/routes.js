

module.exports = function(app, passport) {
     //homepage
     var mongoose = require('mongoose');
     require('../app/models/comments.js');
     require('../app/models/posts.js');
     require('../app/models/subreddit.js');
     
     var Post = mongoose.model('Post');
     var Comment = mongoose.model('Comment');
     var SubReddit = mongoose.model('SubReddit');
 
      
      /*var Query = SubReddit.find({}, function(err, names) {
             if(err) throw err;
             //list = [];
             //for(var i = 0; i < names.length; i++) {
             //console.log(names[i].name);
           // }
             //console.log(names);
             return names;
     });
 
      console.log(Query);     
     */
    /* var x = SubReddit.find({"name" : "funny"}, function(err, sub) {
             if (err) throw err;
             console.log(sub);
      });
     */

      app.get('/r',isLoggedIn, function(req, res) {
         res.render('subreddit.ejs', { 
         user : req.user
         });
         });
     /* app.param('topic', function(req, res, next, name) {
         var Query = SubReddit.find({}, function(err, name) {
             if(err) throw err;
             //console.log(names.name);
            });
         Query.exec(function(error, topic) {
         if(error) { return next(error);}
         if(!topic) { return next(new Error('Can\'t find /r/')); }
         req.topic = topic;
         return next();
         });
     })*/
     app.get('/r/:topic',isLoggedIn, function(req, res) {
            var topic = req.params.topic;
            res.render('posts.ejs', {
            user : req.user
            });
            });
   
    app.get('/r/:topic/:posts', isLoggedIn, function(req, res) {
            res.render('comments.ejs', {
            user: req.user
            });
            }); 
   /* app.get('/r/main',isLoggedIn, function(req, res) {
         res.render('posts.ejs', {
         user : req.user
         });
         });
     */


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
         successRedirect : '/r', //redirect to the secure profile section
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
//get our subreddits
 app.get('/k', function(req, res, next) {
     SubReddit.find(function(err, subreddits) {
       if(err) { return next(err); }
       res.json(subreddits);
       });
     });
//our subreddits, adding them via post method (test with curl -- data) and saveintodb
 app.post('/k', function(req, res, next) {
     var subreddit = new SubReddit(req.body);
     subreddit.save(function(error, subreddit) {
         if(error) { return next(error); }
         res.json(subreddit);
     });
   });
//our link for grabbing our singular subreddit
  app.param('subreddit', function(req,res,next, name) {
     
     var query = SubReddit.find({"name":name});
     //console.log(query)
     query.exec(function(error, subreddit){
     if(error) { return next(error); }
     if(!subreddit) { return next(new Error('Can\'t find /k')); }
     req.subreddit = subreddit;
     //console.log(subreddit);
     return next();
   });
  });

  //middleware
//get our singular subreddit
 app.get('/k/:subreddit', function(req, res) {
     res.json(req.subreddit);
 });
//Our post method to making a new post (Test with curl --data) and save in our db
 app.post('/k/:subreddit/posts', function(req, res, next) {
  var post_s = new Post(req.body);
  post_s.subreddit = req.subreddit;
  
  post_s.save(function(err, post_s){
   if(err){ return next(err); }
   //console.log(post_s.id);
   req.subreddit[0].posts.push(post_s._id);
   req.subreddit[0].save(function(err, subreddit) {
       if(err){return next(err); }
       
       res.json(post_s);
  });
 });
});
//grabbing all the post of a singular sub reddit
app.get('/k/:subreddit/posts', function(req, res, next) {
     Post.find(function(err, post) {
       if(err) { return next(err); }
       res.json(post);
       });
     });

//our parameter for grabbing singluar post
 app.param('post', function(req,res,next, title) {

     var query = Post.find({"title": title});
     //console.log(query)
     query.exec(function(error, post){
     if(error) { return next(error); }
     if(!post) { return next(new Error('Can\'t find /k')); }
     req.post = post;
     //console.log(subreddit);
     return next();
   });
  });
//grabbing our singular post
app.get('/k/:subreddit/posts/:post', function(req, res) {
     res.json(req.post);
 });

app.put('/k/:subreddit/posts/:post/upvote', function(req, res, next) {
    console.log(req.post[0].upvotes);
    req.post[0].upvote(function(err, post) {
        if(err) { return next(err); }
        res.json(post);
    });
}); 

app.get('/k/:subreddit/posts/:post/comments', function(req, res, next) {
     Comment.find(function(err, comments) {
       if(err) { return next(err); }
       res.json(comments);
       });
     });

app.post('/k/:subreddit/posts/:post/comments', function(req, res, next) {
  var comment_s = new Comment(req.body);
  comment_s.post = req.post;
  //console.log(comment_s);
  comment_s.save(function(err, comment_s){
   if(err){ return next(err); }
  // console.log(req.post);
   req.post[0].comments.push(comment_s._id);
   req.post[0].save(function(err, post) {
       if(err){return next(err); }

       res.json(comment_s);
  });
 });
});

//our parameter for grabbing singluar post
 app.param('comment', function(req,res,next, id) {

     var query = Comment.findById(id);
     //console.log(query)
     query.exec(function(error, comment){
     if(error) { return next(error); }
     if(!comment) { return next(new Error('Can\'t find /k')); }
     req.comment = comment;
     //console.log(subreddit);
     return next();
   });
  });

 app.get('/k/:subreddit/posts/:post/comments/:comment', function(req, res) {
     res.json(req.comment);
 });

 app.put('/k/:subreddit/posts/:post/comments/:comment/upvote', function(req, res, next) {
    console.log(req.comment);
    req.comment.upvote(function(err, comment) {
        if(err) { return next(err); }
        res.json(comment);
    });
});


/* 
//calling before the route, faster loading?
   app.param('subreddit', function(req,res,next, name) {
     
     var query = SubReddit.findById( name);
     //console.log(query)
     query.exec(function(error, subreddit){
     if(error) { return next(error); }
     if(!subreddit) { return next(new Error('Can\'t find /k')); }
     req.subreddit = subreddit;
    // console.log(subreddit);
     return next();
   });
  });

app.get('/k/:subreddit', function(request, response) {
   //adding in our populate method, to load all comments associated with a post
  request.subreddit.populate('posts', function(error, subreddit) {
    if (error) { return next(error); }

    response.json(request.subreddit);
  });
});



app.post('/k/:subreddit/posts', function(req, res, next) {
       var post = new Post(req.body);
       post.subreddit = req.subreddit;
       post.save(function(error, post) {
           if(error) { return next(error); }
           req.subreddit.posts.push(post);
           req.subreddit.save(function(error,subreddit) {
             if(error) { return next(error); }
             res.json(post);
       });
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

app.get('/k/:subreddit/:post', function(request, response) {
   //adding in our populate method, to load all comments associated with a post
  request.post.populate('comments', function(error, post) {
    if (error) { return next(error); }

    response.json(request.post);
  });
});
//put our upvote
app.put('/k/:subreddit/:post/upvote', function(req,res,next) {
    req.post.upvote(function(err,post) {
        if (err) { return next(err); }
        res.json(post);
    });
});
//a post request for our comments
app.post('/k/:subreddit/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  //save to our database :) as a comment
  comment.save(function(error, comment) {
   if(error) { return next(error); }
     req.post.comments.push(comment);
     req.post.save(function(error, post) {
         if(error) { return next(error); }
         res.json(post);
     });
   });
 });

//our middleware, for faster loading?
app.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);
  query.exec(function (error, comment) {
    if(error) { return next(new Error('can\'t find post')); }
    req.comment = comment;
    return next();
  });
 });

app.put('/k/:subreddit/:post/comments/:comment/upvote', function(req,res,next) {
   req.comment.upvote(function(error, comment) {
        if (error) { return next(error); }
        res.json(comment);
  });
});	

//grab a single post 
app.get('/k/:subreddit/:post/comments/:comment', function(req, res, next) {
     Comment.find(function(error, comments) {
             if(error) { return next(error); }
             res.json(comments);
             });
     });
//=================  
*/
};
//route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
   //if user is authenticated in the session, carry on
   if (req.isAuthenticated())
      return next(); //cuz we want to move on incase we're stuck here

   //if they arent redirect them to the home page
   res.redirect('/');
}
//================r/routes=====================//



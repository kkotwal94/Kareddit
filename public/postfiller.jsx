/*var mongoose = require('mongoose');
     require('../app/models/comments.js');
     require('../app/models/posts.js');
     require('../app/models/subreddit.js');

     var Post = mongoose.model('Post');
     var Comment = mongoose.model('Comment');
     var SubReddit = mongoose.model('SubReddit');
*/
//var mongoose = require('mongoose');

var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-1];
var converter = new Showdown.converter();
var postInterval = 1000;
var id = '/k/' + sub;

var PostFiller = React.createClass({
  
    loadPostsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
               for(var j = 0; j < data.posts.length; j++) { 
                for( var i = 0; i < data.posts.length-1; i++) {
                   if(data.posts[i].upvotes < data.posts[i+1].upvotes) {
                   var temp = data.posts[i];
                   data.posts[i] = data.posts[i+1];
                   data.posts[i+1] = temp;
                   }         
               }
             }
   
               // console.log(data.posts); 
               this.setState({title:data});
               this.setState({posts:data.posts});
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
    },

    handlePostSubmit : function(post) {
     var post_s = this.state.posts;
     post_s.push(post);
     this.setState({post_s:post}, function() {
           //setState accepts a callback for us, to avoid race condition, we sen           //d the request after we set the new state
           $.ajax({
             url: this.props.urls,
             dataType: 'json',
             type: 'POST',
             data: post,
             success: function(data) {
               this.setState({post_s: data});
             }.bind(this),
             error: function(xhr, status, err) {
                console.error(this.props.urls, status, err.toString());
             }.bind(this)
      });
    });
   },

    getInitialState: function() {
       return {
          posts: [],
          title: []
       }
    },

    componentDidMount: function() {
        //this.sortByUpvotes();
        this.loadPostsFromServer();
        setInterval(this.loadPostsFromServer, this.props.pollInterval);
       // setInterval(this.sortByUpvotes, 1000);
    },
   

   /*sortByUpvotes : function() {
       for( var i = 0; i < this.state.posts.length-1; i++) {
            if(this.state.posts[i].upvotes < this.state.posts[i+1].upvotes) {
                
                var temp = this.state.posts[i];
                this.state.posts[i] = this.state.posts[i+1];
                this.state.posts[i+1] = temp;
          }
      }
               return(
               console.log(this.state.posts),
               this.setState(this.state.posts)
              )
    },*/


    render: function() {
            return(
            <div className = "PostFiller">
            <div className = "jumbotron">
            <h1>{"r/" + this.state.title.name}</h1>
            <div className = "Submit">
             <PostForm onPostSubmit={this.handlePostSubmit} />
            </div>
            </div>
            <hr/>
            <div className = "Posts">
            
            <List posts = {this.state.posts}/>
            </div>
           
            </div>
            )
          }
});


var List = React.createClass({ //has to be called list
    handleUpvote : function(event) {
     console.log("hello");
     $.ajax({
            url: this.props.url + '/' + e + '/upvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
              console.log(data);
              console.log("upvoted");
              //this.setState({title:data});
              //this.setState({posts:data.posts});
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
    },

    handleDownvote : function(e) {
     console.log("hello");
     $.ajax({
            url: this.props.url + '/' + postID + '/downvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
              console.log(data);
              console.log("downvoted");
              //this.setState({title:data});
              //this.setState({posts:data.posts});
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
    },

    render: function() {
    var upvoted = "upvoted";
    var downvoted = "downvoted";
    return(
    <ul>
    {
     this.props.posts.map(function(post) {
         return (
         
         <li key = {post._id}><a href = {post.link}>{post.title}</a>
         <p><a href = {'/r/' + sub +'/'+ post._id} >{post.__v} comments</a> Upvotes : {post.upvotes} By: {post.author} Created on: {new Date(post.date).toUTCString()} <button onClick =
{function(event){
console.log(post._id);
 $.ajax({
            url: id + '/' + post._id + '/upvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
              //console.log(data);
              console.log("upvoted");
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });

}
}>+</button> <button onClick = 
{function(event){
console.log(post._id);
 $.ajax({
            url: id + '/' + post._id + '/downvote',
            dataType: 'json',
            type: 'PUT',
            success: function(data) {
              //console.log(data);
              console.log("downvote");
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });

}
}
>-</button></p>
         <hr/>
          </li>

         )
     })
    }
   </ul>
    )
    }
   });


var PostForm = React.createClass({
    handleSubmit : function(e) {
       e.preventDefault();
       var title  = React.findDOMNode(this.refs.title).value.trim();
       var body   = React.findDOMNode(this.refs.body).value.trim();
       var link   = React.findDOMNode(this.refs.link).value.trim();
       if(!title || !link || !body) {
          return;
       }
       this.props.onPostSubmit({title:title, body:body, link:link});
       React.findDOMNode(this.refs.title).value = '';
       React.findDOMNode(this.refs.body).value = '';
       React.findDOMNode(this.refs.link).value = '';
       },
    render: function() {
       return (
         <form className="postForm" onSubmit={this.handleSubmit}>
            <input type = "text" placeholder="Say Something for post body.." ref="body"/>
            <input type = "text" placeholder="Title..." ref="title"/>
            <input type = "text" placeholder="Title link..Include ...https://" ref="link"/>
            <input type = "submit" value="Post" />
         </form>
   );
  }
 });

//console.log(sub);
React.render(<PostFiller url = {'/k/' + sub} urls = {'/k/' + sub + '/posts/'} pollInterval={postInterval}/>,
document.getElementById('content'));

function myFunction(post) {
  var str;
  for (var i = 0; i< post.length; i++) {
       str += post[i];
  }
}

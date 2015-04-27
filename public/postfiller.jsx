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
var postInterval = 4000;


var PostFiller = React.createClass({
  
    loadPostsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
              //console.log(data.name);
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
        this.loadPostsFromServer();
        setInterval(this.loadPostsFromServer, this.props.pollInterval);
    },
   

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
    render: function() {
    return(
    <ul>
    {
     this.props.posts.map(function(post) {
         return (

         <li key = {post._id}><a href = {'/r/' + sub +'/'+ post._id}>{post.title}</a>
         <p><a href>{post.__v} comments</a> Upvotes : {post.upvotes} By: {post.author}</p>
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
       var author = React.findDOMNode(this.refs.author).value.trim();
       var title  = React.findDOMNode(this.refs.title).value.trim();
       var body   = React.findDOMNode(this.refs.body).value.trim();
       var link   = React.findDOMNode(this.refs.link).value.trim();
       if(!title || !author || !link || !body) {
          return;
       }
       this.props.onPostSubmit({author: author, title:title, body:body, link:link});
       React.findDOMNode(this.refs.author).value = '';
       React.findDOMNode(this.refs.title).value = '';
       React.findDOMNode(this.refs.body).value = '';
       React.findDOMNode(this.refs.link).value = '';
       },
    render: function() {
       return (
         <form className="postForm" onSubmit={this.handleSubmit}>
            <input type = "text" placeholder="Your name" ref="author" />
            <input type = "text" placeholder="Say Something for post body.." ref="body"/>
            <input type = "text" placeholder="Title..." ref="title"/>
            <input type = "text" placeholder="Title link.." ref="link"/>
            <input type = "submit" value="Post" />
         </form>
   );
  }
 });

//console.log(sub);
React.render(<PostFiller url = {'/k/' + sub} urls = {'/k/' + sub + '/posts/'} pollInterval={postInterval}/>,
document.getElementById('content'));


var converter = new Showdown.converter();
var postInterval = 500;


var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-2];
var topic = array[array.length-1];
var ajax_link = '/k/' + sub +'/'+  topic;
var post_link = ajax_link + '/comments';
var CommentFiller = React.createClass({
  
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
              // console.log(data);
               this.setState({comments:data.comments});
               this.setState({title:data})
               
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
    },

    handleCommentSubmit : function(comment) {
     var comment_s = this.state.comments;
     comment_s.push(comment);
     this.setState({comment_s:comment}, function() {
       $.ajax({
           url: this.props.urls,
           dataType: 'json',
           type: 'POST',
           data: comment,
           success: function(data) {
             this.setState({comment_s: data});
             console.log(data);
           }.bind(this), 
           error: function(xhr, status, err) {
             console.error(this.props.urls, status, err.toString());
           }.bind(this)
     });
    });
   },
    getInitialState: function() {
       return {
          comments : [],
          title : []
       }
    },


    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
   

    render: function() {
            
            return(
                  
            <div className = "Comments">
            <div className = "Title">
            <h1>{this.state.title.title}</h1>
            </div>
            <div className = "Threadbody">
            <h2> {this.state.title.body}</h2>
            <h2> {"By: " + this.state.title.author}</h2>
            <hr/>
            <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
            <hr/>
            </div>
            <List comments = {this.state.comments}/>
            
            </div>
            )
          }
});


var List = React.createClass({ //has to be called list
    render: function() {
    //console.log(this.props.comments)

    return(
    <ul>
    {
     this.props.comments.map(function(comment) {
         return (

         <li key = {comment._id}>
         <p>{comment.body}</p>
         <p>Upvotes: {comment.upvotes} <strong>By: {comment.author}</strong>
<button onClick =
{function(event){
console.log(comment._id);
 $.ajax({
            url: ajax_link + '/comments/' + comment._id  + '/upvote',
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
console.log(comment._id);
 $.ajax({
            url: ajax_link + '/comments/' + comment._id + '/downvote',
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
>-</button>
</p>
         <hr/>
          </li>

         )
     })
    }
   </ul>
    )
    }
   });


var CommentForm = React.createClass({
    handleSubmit : function(e) {
       e.preventDefault();
       var author = React.findDOMNode(this.refs.author).value.trim();
       var body   = React.findDOMNode(this.refs.body).value.trim();
       if(!author || !body) {
          return;
       }

       this.props.onCommentSubmit({author:author, body:body});
       React.findDOMNode(this.refs.author).value = '';
       React.findDOMNode(this.refs.body).value = '';
       },
     render: function() {
       return (
          <form className="commentForm" onSubmit={this.handleSubmit}>
             <input type = "text" placeholder="Your name" ref="author"/>
             <input type = "text" placeholder="Comment body.." ref="body"/>
             <input type = "submit" value="Comment" />
          </form>
     );
   }
  });
//====================================



//=============================================================
//console.log(ajax_link);
//console.log(post_link);
//console.log(user.local.email);
React.render(<CommentFiller url = {ajax_link} urls = {post_link} pollInterval={postInterval}/>,
document.getElementById('content'));

var converter = new Showdown.converter();
var postInterval = 4000;


var link = window.location.href;
var array = link.split('/');
var sub = array[array.length-2];
var topic = array[array.length-1];
var ajax_link = '/k/' + sub +'/'+  topic ;
var CommentFiller = React.createClass({
  
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
               console.log(data);
               this.setState({comments:data.comments});
               this.setState({title:data})
               
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
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
            <p> {this.state.title.author}</p>
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

         <li key = {comment.author}>
         <p>{comment.body}</p>
         <p>Upvotes: {comment.upvotes} <strong>By: {comment.author}</strong></p>
         <hr/>
          </li>

         )
     })
    }
   </ul>
    )
    }
   });
//====================================



//=============================================================
//console.log(Jax);
React.render(<CommentFiller url = {ajax_link} pollInterval={postInterval}/>,
document.getElementById('content'));

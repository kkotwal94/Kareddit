var converter = new Showdown.converter();
var postInterval = 4000;


var CommentFiller = React.createClass({
  
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
              // console.log(data.posts);
               this.setState({comments:data.comments});
               this.setState({title:data})
              // console.log(data.comments);
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
            console.log(this.state.comments[0])
            return(
                  
            <div className = "Comments">
            <h1>{this.state.title.title} </h1>
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
React.render(<CommentFiller url = {'/k/55258cfde7edbed110c3dc11/5525bc26c4b4426b1f9f78ae'} pollInterval={postInterval}/>,
document.getElementById('content'));

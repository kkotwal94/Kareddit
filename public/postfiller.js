var converter = new Showdown.converter();
var postInterval = 4000;


var PostFiller = React.createClass({
  
    loadPostsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
              // console.log(data.posts);
               this.setState({posts:data.posts});
            }.bind(this),
        error: function(xhr, status, err) {
               console.error(this.props.url,status, err.toString());
            }.bind(this)
        });
    },


    getInitialState: function() {
       return {
          posts: []
       }
    },


    componentDidMount: function() {
        this.loadPostsFromServer();
        setInterval(this.loadPostsFromServer, this.props.pollInterval);
    },
   

    render: function() {
            return( 
            <div className = "Posts">
            <List posts = {this.state.posts}/>
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

         <li key = {post.title}><a href = {post.link}>{post.title}</a>
         <p><a href>{post.__v} comments</a> Upvotes : {post.upvotes}</p>
         <hr/>
          </li>

         )
     })
    }
   </ul>
    )
    }
   });


React.render(<PostFiller url = {'/k/55258cfde7edbed110c3dc11'} pollInterval={postInterval}/>,
document.getElementById('content'));


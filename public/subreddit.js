var converter = new Showdown.converter();
var postInterval = 4000;//how fast we want our code to refresh/ ajax calls

var Subreddit = React.createClass({
   //we are loading our subreddits from this function in our class using ajax
   
    loadSubredditsFromServer: function() {
       $.ajax({
           url: this.props.url,
	   dataType: 'json',
           //data: JSON.stringify( "__v"),
           success: function(data) {
               //console.log(data[0].__v);
               //console.log(data.length);
               this.setState({subreddits: data});
              
           }.bind(this),
           error: function(xhr, status, err) {
                  console.error(this.props.url, status, err.toString());
           }.bind(this)
         });
    },


    getInitialState: function() {
       return {
          subreddits : []
       }
   },

     componentDidMount: function() {
      this.loadSubredditsFromServer();
      setInterval(this.loadSubredditsFromServer, this.props.pollInterval);
   
     },

     render: function() {
        return (
         <div className = "Subreddits">
        
         <List subreddits = {this.state.subreddits}/>
         </div>
        )
     }
        
});

var List = React.createClass({ //has to be called list
    render: function() {
    return(
    <ul> 
    {
     this.props.subreddits.map(function(subreddit) {
         return (
         
         <li key = {subreddit.name}><a href = {/k/ +subreddit._id}>{subreddit.name}</a>
         <p>{subreddit.__v} posts</p>
         <hr/>
          </li>
          
         )
     })
    }
   </ul>
    )
    }
   });

React.render(<Subreddit url = {'/k/'} pollInterval={postInterval}/>,
document.getElementById('content'));

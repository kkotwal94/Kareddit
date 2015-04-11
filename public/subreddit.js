var converter = new Showdown.converter();
var postInterval = 4000;//how fast we want our code to refresh/ ajax calls

var Subreddit = React.createClass({
   //we are loading our subreddits from this function in our class using ajax
   
    loadSubredditsFromServer: function() {
       $.ajax({
           url: this.props.url,
	   dataType: 'json',
           //data: JSON.stringify( "__v"),
           success: function(name) {
               console.log(name);
               this.setState({subreddits: name});
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
         return <li key = {subreddit}>{subreddit}</li>
     })
    }
   </ul>
    )
    }
   });

React.render(<Subreddit url = {'/k/'} pollInterval={postInterval}/>,
document.getElementById('content'));

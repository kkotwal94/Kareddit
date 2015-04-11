var converter = new Showdown.converter();
var postInterval = 4000;//how fast we want our code to refresh/ ajax calls

var Subreddit = React.createClass({
   //we are loading our subreddits from this function in our class using ajax
    loadSubredditsFromServer: function() {
       $.ajax({
           url: this.props.url,
	   dataType: 'json',
           success: function(data) {
               this.setState({name: data});
           }.bind(this)
         });
    },


    getInitialState: function() {
       return {
          subreddits : []
       };
   },

     componentDidMount: function() {
       this.loadSubredditsFromServer();
       setInterval(this.loadSubredditsFromServer, this.props.pollInterval);
     },

     render: function() {
        return (
         <div className = "Subreddits">
         
         <sList subreddits = {this.state.subreddits}/>
         </div>
        )
     }
        
});

var sList = React.createClass({
    render: function() {
    <ul> 
    {
     this.props.subreddits.map(function(subreddit) {
         return <li key = {subreddit}>{subreddit}</li>
     })
    }
   </ul>
    }
   });

React.render(<Subreddit url = {'localhost:8080/k/'} pollInterval={postFiller}/>,
document.getElementById('content'));

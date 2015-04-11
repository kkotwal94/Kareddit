var mongoose = require('mongoose');

var SubRedditSchema = new mongoose.Schema({
  name   :  String,
  posts  :  [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
});

var SubReddit = mongoose.model('SubReddit', SubRedditSchema);

module.exports = SubReddit;
  

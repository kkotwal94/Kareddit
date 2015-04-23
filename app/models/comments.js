var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  upvotes: {type: Number, default:0},
  post: {type: String, ref: 'Post'}
});

CommentSchema.methods.upvote = function(cb) {
this.upvotes += 1;
this.save(cb);
};

var Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;



var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body      : String,
  author    : String,
  date      : {type: Date},
  upvotes   : {type: Number, default:0},
  post      : {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

CommentSchema.methods.upvote = function(cb) {
this.upvotes += 1;
this.save(cb);
};

CommentSchema.methods.downvote = function(cb) {
this.upvotes -= 1;
this.save(cb);
};

var Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;



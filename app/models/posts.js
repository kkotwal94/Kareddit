var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  link:  String,
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  subreddit: {type: mongoose.Schema.Types.ObjectId, ref: 'SubReddit'}
});


PostSchema.methods.upvote = function(cb) {
this.upvotes += 1;
this.save(cb);
};

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;


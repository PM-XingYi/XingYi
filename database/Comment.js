var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CommentSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'Individual'},
	project: {type: Schema.Types.ObjectId, ref: 'Project'},
	comment: String,
	approved: Boolean
});

var Comment  = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
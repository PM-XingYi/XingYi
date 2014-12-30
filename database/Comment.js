var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CommentSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'Individual'},
	project: {type: Schema.Types.ObjectId, ref: 'Project'},
	date: Date,
	comment: String,
	approved: Number
});

var Comment  = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
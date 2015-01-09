var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var SuperUserSchema = new Schema({
	commentExamine: [{
		comment: {type: Schema.Types.ObjectId, ref: 'Comment'},
		approve: Number,
		remark: String
	}],
	projectExamine: [{
		project: {type: Schema.Types.ObjectId, ref: 'Project'},
		approve: Number,
		remark: String
	}]
});

var SuperUser  = mongoose.model('SuperUser', SuperUserSchema);

module.exports = SuperUser;
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var SuperUserSchema = new Schema({
	commentExamine: [{
		comment: {type: Schema.Types.ObjectId, ref: 'Comment'},
		approve: Boolean,
		remark: String
	}],
	projectExamine: [{
		project: {type: Schema.Types.ObjectId, ref: 'Project'},
		approve: Boolean,
		remark: String
	}]
});

var SuperUser  = mongoose.model('SuperUser', SuperUserSchema);

module.exports = SuperUser;
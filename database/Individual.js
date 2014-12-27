var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var IndividualSchema = new Schema({
	mobile: String,
	joinedProject: [{
		project:{type: Schema.Types.ObjectId, ref: 'Project'},
		status: String,
		joinReason: String
	}],
	watchedProject: [{type: Schema.Types.ObjectId, ref: 'Project'}],
	comment: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
	donation: [{type: Schema.Types.ObjectId, ref: 'Donation'}]
});

var Individual  = mongoose.model('Individual', IndividualSchema);

module.exports = Individual;
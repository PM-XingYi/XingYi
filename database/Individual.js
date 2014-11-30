var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var IndividualSchema = new Schema({
	username: String,
	password: String,
	email: String,
	mobile: String,
	joinedProject: [{type: Schema.Types.ObjectId, ref: 'Project'}],
	watchedProject: [{type: Schema.Types.ObjectId, ref: 'Project'}],
	comment: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
	donation: [{type: Schema.Types.ObjectId, ref: 'Donation'}]
});

var Individual  = mongoose.model('Individual', IndividualSchema);

module.exports = Individual;
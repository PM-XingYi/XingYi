var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var IndividualSchema = new Schema({
	mobile: String,
	application: [{type: Schema.Types.ObjectId, ref: 'Application'}],
	watchedProject: [{type: Schema.Types.ObjectId, ref: 'Project'}],
	comment: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
	donation: [{type: Schema.Types.ObjectId, ref: 'Donation'}]
});

var Individual  = mongoose.model('Individual', IndividualSchema);

module.exports = Individual;
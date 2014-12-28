var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'Individual'},
	project: {type: Schema.Types.ObjectId, ref: 'Project'},
	date: Date,
	status: Number,
	reason: String
});

var Application  = mongoose.model('Application', ApplicationSchema);

module.exports = Application;
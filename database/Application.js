var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'Individual'},
	project: {type: Schema.Types.ObjectId, ref: 'Project'},
	date: {type: Date, default: Date.now},
	status: Number, //passed= 1 pending=2 failed=3
	reason: String
});

var Application  = mongoose.model('Application', ApplicationSchema);

module.exports = Application;
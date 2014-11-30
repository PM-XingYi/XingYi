var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var OrganizationSchema = new Schema({
	username: String,
	password: String,
	email: String,
	phone: String,
	instituteName: String,
	instituteNumber: String,
	project: [{type: Schema.Types.ObjectId, ref: 'Project'}]
});

var Organization  = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;
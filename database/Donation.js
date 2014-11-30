var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var DonationSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'Individual'},
	project: {type: Schema.Types.ObjectId, ref: 'Project'},
	amount: Number,
	anonymous: Boolean
});

var Donation  = mongoose.model('Donation', DonationSchema);

module.exports = Donation;
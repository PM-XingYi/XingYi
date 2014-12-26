var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	name: String,
	desc: String,
	moneyNeeded: Number,
	moneyRaised: Number,
	owner: {type: Schema.Types.ObjectId, ref: 'Organization'},
	joinedIndividual: [{type: Schema.Types.ObjectId, ref: 'Individual'}],
	comment: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
	donation: [{type: Schema.Types.ObjectId, ref: 'Donation'}],
	mileStone: [{
		date: Date,
		title: String,
		desc: String
	}],
	expenditure: [{
		date: Date,
		expense: Number,
		usage: String
	}],
	approved: String
});

var Project  = mongoose.model('Project', ProjectSchema);

module.exports = Project;

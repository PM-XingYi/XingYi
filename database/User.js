var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	md5 = require('MD5');

var UserSchema = new Schema({
	username: String,
	password: String,
	email: String,
	userType: String,
	detail: {type: Schema.Types.ObjectId}
});

UserSchema.methods.validPassword = function(password) {
    return (md5(password) === this.password);
};

var User  = mongoose.model('User', UserSchema);

module.exports = User;
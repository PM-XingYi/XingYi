var go = require('../globalObjects');

var IndividualService = function () {
}

/*
 * register an individual user
 * @param {String} username (unique)
 * @param {String} MD5 of password
 * @param {String} email
 * @param {String} mobile
 * @return {Boolean} success
 */
IndividualService.prototype.register = function (username, password, email, mobile) {

};
/*
 * Return user info by username
 * @param {String} username
 * @return {Individual} user
 */
IndividualService.prototype.getUser = function (username, callback) {
	go.database.User.findOne({username: username}, function (err, user) {
		if (err) {
			callback({
				success: false,
				message: "internal error"
			});
		} else {
			var answer = JSON.parse(JSON.stringify(user));
			go.database.Individual.findById(user.detail, function (err, individual) {
				if (err) {
					callback({
						success: false,
						message: "internal error"
					});
				} else {
					answer.detail = individual;
					callback({
						success: true,
						message: answer
					});
				}
			});
		}
	});
};


/*
 * add project to user's watch list
 * @param {String} username
 * @param {ObjectId} project id
 * @return {Boolean} success
 */
IndividualService.prototype.watchProject = function (username, projectID) {

};
/*
 * delete project to user's watch list
 * @param {String} username
 * @param {ObjectId} project id
 * @return {Boolean} success
 */
IndividualService.prototype.cancelWatchProject = function (username, projectID) {

};
/*
 * get user's watch list
 * @param {String} username
 * @return {Array of Project} project list
 */
IndividualService.prototype.getWatchProjectList = function (username) {

};


/*
 * add project to user's join list
 * @param {String} username
 * @param {ObjectId} project id
 * @return {Boolean} success
 */
IndividualService.prototype.joinProject = function (username, projectID) {

};
/*
 * delete project to user's join list
 * @param {String} username
 * @param {ObjectId} project id
 * @return {Boolean} success
 */
IndividualService.prototype.cancelJoinProject = function (username, projectID) {

};
/*
 * get user's join list
 * @param {String} username
 * @return {Array of Project} project list
 */
IndividualService.prototype.getJoinProjectList = function (username) {

};


/*
 * add project to user's donation list
 * @param {String} username
 * @param {ObjectId} project id
 * @param {
 *   @param {Date} date
 *   @param {Number} amount
 *   @param {String} remark
 *   @param {Boolean} anonymous
 * } donation info
 * @return {Boolean} success
 */
IndividualService.prototype.donateProject = function (username, projectID, donateInfo) {

};
/*
 * get user's donation list
 * @param {String} username
 * @return {Array of Donation} donation list
 */
IndividualService.prototype.getDonateProjectList = function (username) {

};


/*
 * add comment for user to project
 * @param {String} username
 * @param {ObjectId} project id
 * @param {
 *   @param {Date} date
 *   @param {String} comment
 * } comment info
 * @return {Boolean} success
 */
IndividualService.prototype.commentProject = function (username, projectID, commentInfo) {

};
/*
 * get user's comment list
 * @param {String} username
 * @return {Array of Comment} comment list
 */
IndividualService.prototype.getCommentProjectList = function (username) {

};
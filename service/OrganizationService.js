var OrganizationService = function () {

}

/*
 * register an individual user
 * @param {String} username (unique)
 * @param {String} MD5 of password
 * @param {String} email
 * @param {String} phone
 * @param {String} organization name
 * @param {String} organization number
 * @return {Boolean} success
 */
OrganizationService.prototype.register = function (username, password, email, phone, orgName, orgNumber) {

}
/*
 * return user info by username
 * @param {String} username
 * @return {Individual} user
 */
OrganizationService.prototype.getUser = function (username) {

}


/*
 * publish a project
 * @param {String} username
 * @param {
 *   @param {String} name
 *   @param {String} desc
 *   @param {Number} moneyNeeded
 * } project info
 * @return {Boolean} success
 */
OrganizationService.prototype.publishProject = function (username, projectInfo) {

}
/*
 * add milestone for a project
 * @param {String} username
 * @param {ObjectId} project id
 * @param {
 *   @param {Date} date
 *   @param {String} title
 *   @param {String} desc
 * } milestone
 * @return {Boolean} success
 */
OrganizationService.prototype.addMilestone = function (username, projectID, milestone) {

}
/*
 * add expenditure for a project
 * @param {String} username
 * @param {ObjectId} project id
 * @param {
 *   @param {Date} date
 *   @param {Number} expense
 *   @param {String} usage
 * } expenditure
 * @return {Boolean} success
 */
OrganizationService.prototype.addExpenditure = function (username, projectID, expenditure) {

}

var assert = require("assert");

describe('DatabaseService', function() {
    describe('#connect()', function() {
        it('should return success/error message', function() {
			var databaseService = require('../service/DatabaseService');
            databaseService.connect(function(msg) {
				assert.equal(msg, "connect success!");
			}, function(e) {
				assert.notEqual(msg, "connect success!");
			})
        });
    });
});



describe('IndividualService', function() {
    describe('#register()', function() {
        it('return fail if user exists', function() {
			var individualService = require('../service/IndividualService');
            individualService.register("username", "password", "email", "mobile",
				function(info) {
					assert.equal(info.success, true);
}
			);
        });
    });
});

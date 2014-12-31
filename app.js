var express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	expressSession = require('express-session'),
	exphbs  = require('express-handlebars'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index'),
	login = require('./routes/login'),
	register = require('./routes/register'),
	individual = require('./routes/individual'),
	organization = require('./routes/organization'),
	superuser = require('./routes/superuser'),
	project = require('./routes/project');

var go = require('./globalObjects');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
var hbs = exphbs.create({
	helpers: {
		ifEq: function(v1, v2, options) {
			if(v1 === v2) {
				return options.fn(this);
			}
			return options.inverse(this);
		}
	}
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.bodyParser({uploadDir:'./uploads'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/img", express.static(path.join(__dirname, 'public/img')));
app.use(cookieParser());
app.use(expressSession({secret: 'secret key'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	done(null, user.id);
});
passport.deserializeUser(function(id, done) {
	go.database.User.findById(id, function(err, user) {
		done(err, user);
	});
});
passport.use(new LocalStrategy(
	function(username, password, done) {
		go.database.User.findOne({username: username}, function (err, user) {
			if (err) { return done(err); }
			if (!user) {
				// console.log('no user');
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (!user.validPassword(password)) {
				// console.log('wrong password');
				return done(null, false, { message: 'Incorrect password.' });
			}
			// console.log('correct password');
			return done(null, user);
		});
	}
));

app.use('/', index);
app.use('/login', login);
app.use('/register', register);
app.use('/individual', individual);
app.use('/organization', organization);
app.use('/superuser', superuser);
app.use('/project', project);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	// res.render('error', {
	// 	message: err.message,
	// 	error: {}
	// });
});


go.database.connect(function(msg) {
	console.log(msg);
}, function(err) { 
	console.log(err);
});

module.exports = app;

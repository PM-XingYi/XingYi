$(function() {
	/* 
		Home Page
	*/
	// header login entry, go to login
	$("#login-entry").bind("click", function() {
		location.href = "login.html";
		// TODO
	});
	// header register entry, go to register
	$("#register-entry").bind("click", function() {
		location.href = "register.html";
		// TODO
	});
	// user entry, go to user profile view
	$("#user-entry").bind("click", function() {
		location.href = "profile_view.html";
		// TODO
	});
	// dashboard entry, go to dashboard
	$("#dashboard-entry").bind("click", function() {
		location.href = "admin_dashboard.html";
		// TODO
	});
	// logout entry, to log out
	$("#logout-entry").bind("click", function() {
		// TODO
	});
	//
	$("#search-icon").bind("click", function() {	//important!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		if($("#search-box").val()!="") {	// go to search page
			//TODO
			//key word is $("#search-box").val()
		}
	});
	//project box, if click, it should be linked to the detailed page of such project
	$(".project-title").bind("click", function() {
		//TODO
		console.log($(this).text());
	});
	
	/*
		Profile View Page
	*/
	// edit button -- go to profile edit page
	$("#profile-edit-wrapper #edit").bind("click", function() {
		// TODO
		location.href = "profile_edit.html";
	});

	/*
		Profile Edit Page
	*/
	// save button
	$("#profile-edit-wrapper #save").bind("click", function() {
		var gender = $("input[name='gender']:checked").val();
		var nickname = $("#nickname").val();
		var phonenumber = $("#number").val();
		var email = $("#email").val();
		console.log(gender+" "+nickname+" "+phonenumber+" "+email);
		// TODO -- save the information
	});
	// cancel button, go back to the previous page, here is profile view page
	$("#profile-edit-wrapper #cancel").bind("click", function() {
		// TODO
		location.href = "profile_view.html";
	});

	/*
		Forget Reset Page
	*/
	$("#forget-reset-wrapper #submit").bind("click", function() {
		var email = $("#email").val();
		var username = $("#username").val();
		var password = $("#pwd").val();
		// TODO
	});

	/*
		Forget Send Page
	*/
	// send, get the email address of the user
	$("#forget-send-wrapper #send").bind("click", function() {
		var email = $("#email").val();
		// TODO
	});

	/*
		Login Page
	*/
	// forget password, go to forget_send
	$("#login-wrapper #forget").bind("click", function() {
		location.href = "forget_send.html";
		// TODO
	});
	// register, go to register
	$("#login-wrapper #register").bind("click", function() {
		location.href = "register.html";
		// TODO
	});
	// login
	$("#login-wrapper #login").bind("click", function() {
		var username = $("#username").val();
		var password = $("#pwd").val();
		// TODO
	});

	/*
		Register Page
	*/
	// register button, to register
	$("#register-wrapper #register").bind("click", function() {
		var identify = $("input[name='identify']:checked").val();
		var username = $("#username").val();
		var pwd = $("#pwd").val();
		var email = $("#email").val();
		console.log(identify+" "+username+" "+pwd+" "+email);
		// TODO -- save the information
	});

	//load more, ajax, append project to collection, to do
	$("#more").bind("click", function() {
		//TODO
		// just an example
		$(".collection").append("<article></article>");
	});



});
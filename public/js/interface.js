$(function() {
	/* 
		Home Page
	*/
	// header login entry, go to login
	$("#login-entry").bind("click", function() {
		location.href = "login.html";
	});
	// header register entry, go to register
	$("#register-entry").bind("click", function() {
		location.href = "register.html";
	});
	// user entry, go to user profile view
	$("#user-entry").bind("click", function() {
		location.href = "/individual/profile";
	});
	// dashboard entry, go to dashboard, here should be some types....
	// Admin Dashboard
	$("#admin-comments-management-wrapper #dashboard-entry").bind("click", function() {
		location.href = "/superuser/home";
	});
	$("#project-verify-wrapper #dashboard-entry").bind("click", function() {
		location.href = "/superuser/home";
	});
	// Dashboard Individual
	$("#recent-operations-user-wrapper #dashboard-entry").bind("click", function() {
		location.href = "/individual/home";
	});
	$("#view-followedpjs-user-wrapper #dashboard-entry").bind("click", function() {
		location.href = "/individual/home";
	});
	$("#view-participatingpjs-user-wrapper #dashboard-entry").bind("click", function() {
		location.href = "/individual/home";
	});
	// Dashboard Organization
	$("#view-all-project-manager-wrapper #dashboard-entry").bind("click", function() {
		location.href = "/organization/home";
	});
	$("#create-new-project-manager-wrapper #dashboard-entry").bind("click", function() {
		location.href = "/organization/home";
	});

	// dashboard entry, go to dashboard, here should be some types....
	// Admin Dashboard
	$("#admin-comments-management-wrapper #go-back-dashboard").bind("click", function() {
		location.href = "/superuser/home";
	});
	$("#project-verify-wrapper #go-back-dashboard").bind("click", function() {
		location.href = "/superuser/home";
	});
	// Dashboard Individual
	$("#recent-operations-user-wrapper #go-back-dashboard").bind("click", function() {
		location.href = "/individual/home";
	});
	$("#view-followedpjs-user-wrapper #go-back-dashboard").bind("click", function() {
		location.href = "/individual/home";
	});
	$("#view-participatingpjs-user-wrapper #go-back-dashboard").bind("click", function() {
		location.href = "/individual/home";
	});
	// Dashboard Organization
	$("#view-all-project-manager-wrapper #go-back-dashboard").bind("click", function() {
		location.href = "/organization/home";
	});
	$("#create-new-project-manager-wrapper #go-back-dashboard").bind("click", function() {
		location.href = "/organization/home";
	});
	

	// logout entry, to log out
	$("#logout-entry").bind("click", function() {
		location.href = "/login/logout";
	});
	//
	$("#search-icon").bind("click", function() {	//important!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		if($("#search-box").val()!="") {	// go to search page
      location.href="/project/search?keyword=" + encodeURIComponent($("#search-box").val());

		}
	});
	//project box, if click, it should be linked to the detailed page of such project
	$(".project-title.public").bind("click", function() {
		var id = $(this).parents("article").find(".for-id").text();
		location.href = "/project/" + id;
	});
	$(".project-title.organization").bind("click", function() {
		var id = $(this).parents("article").find(".for-id").text();
		location.href = "/organization/project/" + id;
	});

	/*
		Individual Profile Edit Page
	*/
	$("#individual-profile #save").bind("click", function() {
		/*var gender = $("input[name='gender']:checked").val();
		var nickname = $("#nickname").val();
		var phonenumber = $("#number").val();
		var email = $("#email").val();
		console.log(gender+" "+nickname+" "+phonenumber+" "+email);*/
		$.ajax({
			url: "/individual/profile/edit",
			type: "POST",
			data: {
				phonenumber: $("#number").val(),
				email: $("#email").val()
			},
			error: function() {

			}
		});
	});
	$("#individual-profile #cancel").bind("click", function() {
		// TODO-- cancel edit
	});

	/*
		Organization Profile Edit Page
	*/
	$("#organization-profile #save").bind("click", function() {
		var phonenumber = $("#number").val();
		var email = $("#email").val();
		var desc = $("#intro").val();
		console.log(gender+" "+nickname+" "+phonenumber+" "+email+" "+intro);
		// TODO -- save the information
	});
	$("#organization-profile #cancel").bind("click", function() {
		// TODO-- cancel edit
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
		ev.preventDefault();
		// TODO
	});


	/*
		Register Page
	*/
	// register button, to register
	$("#register-wrapper input[name='identify'][value='普通用户']").focus(function () {
		$("#mobile").show();
		$("#phone").hide();
		$("#orgNumber").hide();
		$("#orgName").hide();
	});
	$("#register-wrapper input[name='identify'][value='项目管理者']").focus(function () {
		$("#mobile").hide();
		$("#phone").show();
		$("#orgNumber").show();
		$("#orgName").show();
	});
	$("#register-wrapper #register").bind("click", function() {
		if ($("#pwd").val() !== $("#pwd2").val()) {
			alert("两次输入密码不一致");
			return;
		}
		if ($('#agree').attr("checked") !== "checked") {
			alert("请同意行益网条款");
			return;
		}
		var identify = $("input[name='identify']:checked").val();
		if(identify === "普通用户") {
			$.ajax({
				url: "/register/individual",
				type: "POST",
				data: {
					username: $("#username").val(),
					password: $("#pwd").val(),
					email: $("#email").val(),
					mobile: $("#mobile").val()
				},
				success: function (data) {
					if (data && data.success) {
						alert("注册成功，请登录");
					}
					else {
						alert("注册失败 " + (data ? data.message : "!"));
					}
				}
			});	
		} else {
			$.ajax({
				url: "/register/organization",
				type: "POST",
				data: {
					username: $("#username").val(),
					password: $("#pwd").val(),
					email: $("#email").val(),
					phone: $("#phone").val(),
					orgNumber: $("#orgNumber").val(),
					orgName: $("#orgName").val()
				},
				success: function (data) {
					if (data && data.success) {
						alert("注册成功，请登录");
					}
					else {
						alert("注册失败 " + (data ? data.message : "!"));
					}
				}
			});	
		}
	});

	/*
		View Detail Page
	*/
	// star button, to watch/star that project
	$("#view-details-wrapper #star").bind("click", function() {
		var id = $(this).parents("#view-details-wrapper").find(".for-id").text();
		$.ajax({
			url: "/individual/project/watch/"+id,
			type: "POST",
			error: function() {

			}
		});
	});


	/*
		Admin Must Login --- SuperUser
	*/
	// SuperUser Login
	$("#superuser-login-wrapper #username").focus();
	$("#superuser-login-wrapper").bind("keydown", function(e) {
		if(e.keyCode==13) {
			var act = document.activeElement.id;
			if(act=="username") {
				$("#pwd").focus();
			} else if(act=="pwd") {
				$.ajax({
					url: "/login/superuser",
					type: "POST",
					data: {username:$("#username").val(), password:$("#pwd").val()},
					error: function() {

					}
				});
			} 
		}
	});

	/*
		Admin Dashboard
	*/
	// project verify, go to project verify
	$("#admin-dashboard-wrapper #project-verify").bind("click", function() {
		location.href = "/superuser/examProject";
	});
	// comment manager, go to comment manager
	$("#admin-dashboard-wrapper #comment-manager").bind("click", function() {
		location.href = "/superuser/examComment";
	});


	//load more, ajax, append project to collection, to do
	//not needed any more
	/*$("#more").bind("click", function() {
		//TODO
		// just an example
		$(".collection").append("<article></article>");
	});*/


	/*
		Admin Comments Management
	*/
	// NOTE: because of incosisitency, the name may be confused....so ignore that....
	// Also for this page, pop-up for more details has not been done yet.. May return here some time later
	// preserve this comment
	// just set it to be passed
	$("#admin-comments-management-wrapper #all_project .preserve").bind("click", function() {
		var row = $(this).parents(".row");
    var commentId = row.children(".for-id").text()

		$.ajax({
			url: "/superuser/examComment",
			type: "POST",
			data: {
				commentID: commentId,
				approve: 1,
				remark: ""
			}
		}).then(function(data){
      if (data && data.success) {
        row.remove();
        $("#admin-comments-management-wrapper #star_project .collection").append(row);
      }
			else {
				alert("失败 " + (data ? data.message : "!"));
			}
		});

	});
	// delete this comment
	// just set it to be unpassed.
	$("#admin-comments-management-wrapper #all_project .delete").bind("click", function() {
		var row = $(this).parents(".row");
    var commentId = row.children(".for-id").text()

		$.ajax({
			url: "/superuser/examComment",
			type: "POST",
			data: {
				commentID: commentId,
				approve: 3,
				remark: ""
			}
		}).then(function(data){
      if (data && data.success) {
        row.remove();
        $("#admin-comments-management-wrapper #join_project .collection").append(row);
      }
			else {
				alert("失败 " + (data ? data.message : "!"));
			}
		});

	});
	// preserve all selected.
	// just set them to be passed
	$("#admin-comments-management-wrapper #preserve-checked").bind("click", function() {
		$("#admin-comments-management-wrapper #all_project").find(".collection").children(".row").filter(function() {
			return $(this).css("display")=="block";	
		}).find(".check").filter(function() {
			return $(this).is(':checked');
		}).each(function() {
			var row = $(this).parents(".row");
			row.remove();
			$("#admin-comments-management-wrapper #star_project .collection").append(row);
			
			// TODO, for the server

		});

		//////// A trick, need optimaization1!!!!!!!!!! //////////////////
		// Page navigation update.... Do it later!!!
		$("#admin-comments-management-wrapper #all_project").find(".active_page").click();
		$("#admin-comments-management-wrapper #star_project").find(".active_page").click();
		///////////////////////////////////////////////////////////////////
	});
	// delete all selected.
	// just set them to be unpassed
	$("#admin-comments-management-wrapper #delete-checked").bind("click", function() {
		$("#admin-comments-management-wrapper #all_project").find(".collection").children(".row").filter(function() {
			return $(this).css("display")=="block";	
		}).find(".check").filter(function() {
			return $(this).is(':checked');
		}).each(function() {
			var row = $(this).parents(".row");
			row.remove();
			$("#admin-comments-management-wrapper #join_project .collection").append(row);
			
			// TODO, for the server

		});
		//////// A trick, need optimaization1!!!!!!!!!! //////////////////
		// Page navigation update.... Do it later!!!
		$("#admin-comments-management-wrapper #all_project").find(".active_page").click();
		$("#admin-comments-management-wrapper #join_project").find(".active_page").click();
		///////////////////////////////////////////////////////////////////
	});


	/**
		Individual Dashboard
	**/
	// operate history, go to operate history, link
	$("#dashboard-individual-wrapper #operate-history").bind("click", function() {
		location.href = "recent_operations_user.html";
		//TODO
	});
	// scan star, have a look at projects starring
	$("#dashboard-individual-wrapper #scan-star").bind("click", function() {
		location.href = "view_followedpjs_user.html";
		//TODO
	});
	// scan join, have a look at projects joining
	$("#dashboard-individual-wrapper #scan-join").bind("click", function() {
		location.href = "view_participatingpjs_user.html";
		//TODO
	});
	
	/**
		View Followed Projects User
	**/
	// button unstar, just mark that project not followed
	$("#view-followedpjs-user-wrapper .unstar").bind("click", function() {
		var id = $(this).parents(".project-wrapper").find(".for-id").text();
		$.ajax({
			url: "/individual/project/unwatch/"+id,
			type: "POST",
			error: function() {

			}
		});
	});

	/*
		View Detail
	*/
	// this is for donate button, go to donate page
	$("#view-details-wrapper #donate").bind("click", function() {
		var projectID = $(".for-id").text();
		location.href = "/individual/donate/" + projectID;
	});
	//this is for comment button, just make comments
	$("#view-details-wrapper #make-comment").bind("click", function() {
		/*var isAnonymous = $(".comment-form input[type='checkbox']").is(':checked');
		var comment = $(".comment-form textarea").val();*/
		$.ajax({
			url: "/individual/comment",
			type: "POST",
			data: {comment:$(".comment-form textarea").val()},
			error: function() {

			}
		});
	});
	//this is for apply confirm
	$("#view-details-wrapper #apply-form #confirm-apply").bind("click", function() {
		var reason = $("#view-details-wrapper #apply-form textarea").val();
		// TODO, the server

	});

	/*
		Donate
	*/
	// back
	$("#donate-wrapper #return").bind("click", function() {
		var projectID = $(".for-id").text();
		location.href = "/project/" + projectID;
	});
	// donate
	$("#donate-wrapper #go-to-donate").bind("click", function() {
		var _money = $("input[name='money']:checked").val();
		if(_money=="其他")
			var money = $("#donate-wrapper input[type='text']").val();
		else
			var money = parseInt(_money);
		var way = $("input[name='way']:checked").val();
		var isAnonymous = $("#donate-wrapper input[type='checkbox']").is(':checked');

		$.ajax({
			url: "/individual/donate",
			type: "POST",
			data: {
				amount: money,
				anonymous: isAnonymous,
				project: $(".for-id").text(),
				remark: $("input[name='remark']").text()
			},
			success: function(data) {
				if (data && data.success) {
					alert("捐款成功！谢谢您的爱心！");
				}
				else {
					alert("啊哦失败了:( " + (data ? data.message : ""));
				}
			}
		});
	});
	
	/**
		For Dashboard Organization
	**/
	// create a project
	$("#dashboard-organization-wrapper #create-project").bind("click", function() {
		location.href = "/organization/publish";
	});
	// edit project
	$("#dashboard-organization-wrapper #edit-project").bind("click", function() {
		location.href = "/organization/project";
	});

	/*
		For View All Project Manager
	*/
	// Edit projects
	$("#view-all-project-manager-wrapper button.rounded-button").filter(function() {
		return !$(this).hasClass("disable-button")
	}).bind("click", function() {
		console.log($(this).parents(".project-wrapper").find(".for-id"));
		var projectID = $(this).parents(".project-wrapper").find(".for-id").text();
		location.href = "/organization/project/" + projectID + "/edit";
	});


	/**
		For Create New Project Manager
	**/
	$("#create-new-project-manager-wrapper #publish-project").bind("click", function() {
		var name_of_project = $("#name-of-project").val();
		var intro_of_project = $("#intro-of-project").val();
		var filename = $("input[type='file']").val();
		var reason_of_project = $("#reason-of-project").val();
		var title_of_copy = $("#title-of-copy").val();
		var content_of_copy = $("#content-of-copy").val();
		var inform_of_join = $("#inform-of-join").val();
		var goal_of_kick = $("#goal-of-kick").val();
		var explain_of_goal = $("#explain-of-goal").val();
		var content_of_intro = $("#content-of-intro").val();
		//TODO,  for the server
	});

	/**
		For Dashboard Edit Project
	**/
	// base information
	$("#dashbaord-edit-project-wrapper #base-info").bind("click", function() {
		var projectID = $(".for-id").text();
		location.href = "/organization/project/" + projectID + "/edit";
	});
	// Message Update
	$("#dashbaord-edit-project-wrapper #message-update").bind("click", function() {
		var projectID = $(".for-id").text();
		location.href = "/organization/project/" + projectID + "/milestone";
	});
	// Expense Management
	$("#dashbaord-edit-project-wrapper #expense-manage").bind("click", function() {
		var projectID = $(".for-id").text();
		location.href = "/organization/project/" + projectID + "/expenditure";
	});
	// Volunteer Management
	$("#dashbaord-edit-project-wrapper #joiner-manage").bind("click", function() {
		var projectID = $(".for-id").text();
		location.href = "/organization/project/" + projectID + "/volunteer";
	});

	/**
		For BaseInfo Edit
	**/
	// save button
	$("#baseinfo-edit-wrapper #save-project-img").bind("click", function() {
		var projectID = $(".for-id").text();
		var image = $("#edit-img")[0].files[0];

		var data = new FormData();
		data.append("image", image);

		$.ajax({
			type: "POST",
			url: "/organization/project/" + projectID + "/editImg",
			data: data,
			contentType: false,
			processData: false,
			success: function (data) {
				if (data && data.success) {
					alert("修改图片成功！");
					location.href = "/organization/project/" + projectID + "/edit";
				}
				else {
					alert("啊哦失败了:(");
				}
			}
		});
	});
	$("#baseinfo-edit-wrapper #save-project").bind("click", function() {
		var projectID = $(".for-id").text();
		var desc = $("#edit-desc").val();
		var longDesc = $("#edit-longDesc").val();
		var notice = $("#edit-notice").val();

		$.ajax({
			type: "POST",
			url: "/organization/project/" + projectID + "/edit",
			data: {
				project: projectID,
				desc: desc,
				longDesc: longDesc,
				notice: notice
			},
			success: function (data) {
				if (data && data.success) {
					alert("修改成功！");
					location.href = "/organization/project/" + projectID + "/edit";
				}
				else {
					alert("啊哦失败了:( " + (data ? data.message : ""));
				}
			}
		});
	});

	/**
		For Add News
	**/
	// publish news
	$("#add-news-wrapper #publish-news").bind("click", function() {
		var projectID = $(".for-id").text();
		var date = $("#news-date").val();
		var title = $("#news-title").val();
		var content = $("#news-content").val();

		var data = {
			date: date,
			title: title,
			desc: content
		};
		$.ajax({
			method: "POST",
			url: "/project/" + projectID + "/milestone/add",
			data: data,
			success: function (data) {
				if (data && data.success) {
					alert("发布成功！");
					location.reload();
				}
				else {
					alert("发布失败:( " + (data ? data.message : ""));
				}
			}
		})
	});

	function editItemNews(obj) {
		obj.parents(".row").children(".col-2").attr("contentEditable", true).css({"border": "1px solid #ccc"});
		obj.unbind("click");
		obj.text("保存").removeClass("edit").addClass("save").bind("click", function() {
			saveItemNews($(this));
		});
		obj.next().unbind("click");
		obj.next().text("放弃").removeClass("remove").addClass("cancel").bind("click", function() {
			cancelItemNews($(this));
		});
	}
	function saveItemNews(obj) {
		obj.parents(".row").children(".col-2").attr("contentEditable", false).css({"border": "none"});
		obj.unbind("click");
		obj.text("编辑").removeClass("save").addClass("edit").bind("click", function() {
			editItemNews($(this));
		});
		obj.next().unbind("click");
		obj.next().text("删除").removeClass("cancel").addClass("remove").bind("click", function() {
			removeItemNews($(this));
		});
		// TODO, for the server, save news item
		var content = obj.parents(".row").children(".col-2").text();
	}
	function removeItemNews(obj) {
		obj.parents(".row").remove();
		// TODO, for the server, delete news item
	}
	function cancelItemNews(obj) {
		obj.parents(".row").children(".col-2").attr("contentEditable", false).css({"border": "none"});
		obj.unbind("click");
		obj.text("删除").removeClass("cancel").addClass("remove").bind("click", function() {
			removeItemNews($(this));
		});
		obj.prev().unbind("click");
		obj.prev().text("编辑").removeClass("save").addClass("edit").bind("click", function() {
			editItemNews($(this));
		});
	}
	$("#add-news-wrapper .show .collection button.edit").bind("click", function() {
		editItemNews($(this));
	});
	// remove
	$("#add-news-wrapper .show .collection button.remove").bind("click", function() {
		removeItemNews($(this));
	});

	

	/**
		For Book Keeping
	**/
	// publish book
	$("#bookkeeping-wrapper #publish-book").bind("click", function() {
		var projectID = $(".for-id").text();
		var date = $("#book-date").val();
		var number = parseInt($("#book-number").val());
		var content = $("#book-content").val();
		
		var data = {
			date: date,
			expense: number,
			usage: content
		};
		console.log(data);
		$.ajax({
			method: "POST",
			url: "/organization/project/" + projectID + "/expenditure/add",
			data: data,
			success: function (data) {
				if (data && data.success) {
					alert("添加成功！");
					location.reload();
				}
				else {
					alert("添加失败:( " + (data ? data.message : ""));
				}
			}
		})
	});

	function editItemBook(obj) {
		obj.parents(".row").children(".col-1").attr("contentEditable", true).css({"border": "1px solid #ccc"});
		obj.parents(".row").children(".col-2").attr("contentEditable", true).css({"border": "1px solid #ccc"});
		obj.parents(".row").children(".col-3").attr("contentEditable", true).css({"border": "1px solid #ccc"});
		obj.unbind("click");
		obj.text("保存").removeClass("edit").addClass("save").bind("click", function() {
			saveItemBook($(this));
		});
		obj.next().unbind("click");
		obj.next().text("放弃").removeClass("remove").addClass("cancel").bind("click", function() {
			cancelItemBook($(this));
		});
	}
	function saveItemBook(obj) {
		obj.parents(".row").children(".col-1").attr("contentEditable", false).css({"border": "none"});
		obj.parents(".row").children(".col-2").attr("contentEditable", false).css({"border": "none"});
		obj.parents(".row").children(".col-3").attr("contentEditable", false).css({"border": "none"});
		obj.unbind("click");
		obj.text("编辑").removeClass("save").addClass("edit").bind("click", function() {
			editItemBook($(this));
		});
		obj.next().unbind("click");
		obj.next().text("删除").removeClass("cancel").addClass("remove").bind("click", function() {
			removeItemBook($(this));
		});
		// TODO, for the server, save book item
		var date = obj.parents(".row").children(".col-1").text();
		var number = obj.parents(".row").children(".col-2 div").text();
		var content = obj.parents(".row").children(".col-3").text();

	}
	function removeItemBook(obj) {
		obj.parents(".row").remove();
		// TODO, for the server, delete book item
	}
	function cancelItemBook(obj) {
		obj.parents(".row").children(".col-1").attr("contentEditable", false).css({"border": "none"});
		obj.parents(".row").children(".col-2").attr("contentEditable", false).css({"border": "none"});
		obj.parents(".row").children(".col-3").attr("contentEditable", false).css({"border": "none"});
		obj.unbind("click");
		obj.text("删除").removeClass("cancel").addClass("remove").bind("click", function() {
			removeItemBook($(this));
		});
		obj.prev().unbind("click");
		obj.prev().text("编辑").removeClass("save").addClass("edit").bind("click", function() {
			editItemBook($(this));
		});
	}
	$("#bookkeeping-wrapper .show .collection button.edit").bind("click", function() {
		editItemBook($(this));
	});
	// remove
	$("#bookkeeping-wrapper .show .collection button.remove").bind("click", function() {
		removeItemBook($(this));
	});

	/**
		For Page Volunteer Manager
	**/
	function editItemVolunteer(obj) {
		obj.parents(".row").children(".col-5").attr("contentEditable", true).css({"border": "1px solid #ccc"});
		obj.unbind("click");
		obj.text("保存").removeClass("edit").addClass("save").bind("click", function() {
			saveItemVolunteer($(this));
		});
	}
	function saveItemVolunteer(obj) {
		obj.parents(".row").children(".col-5").attr("contentEditable", false).css({"border": "none"});
		obj.unbind("click");
		obj.text("编辑").removeClass("save").addClass("edit").bind("click", function() {
			editItemVolunteer($(this));
		});
		// TODO, for the server
		var note = obj.parents(".row").children(".col-5").text();

	}
	$("#volunteer-management-wrapper .show .collection button.edit").bind("click", function() {
		editItemVolunteer($(this));
	});

	/**
		For Page Volunteer Manage
	**/
	// accept the application of the volunteer
	$("#volunteer-management-wrapper .show button.pass").bind("click", function() {
		var row = $(this).parents(".card-part");
		var username = row.find(".volunteer-username").text();
		var nickname = row.find(".volunteer-nickname").text();
		var number = row.find(".volunteer-number").text();
		var mail = row.find(".volunteer-mail").text();
		row.remove();
		var html = "<div class='row'><div class='col-1'>"+
					username+"</div><div class='col-2'>"+
					nickname+"</div><div class='col-3'>"+
					number+"</div><div class='col-4'>"+
					mail+"</div><div class='col-5'></div><div class='col-6'><button class='rounded-button edit'>编辑</button></div></div>";
		$("#volunteer-management-wrapper #all_project .show .collection").append(html);
		// TODO, for the server
	});
	// or else, refuse
	$("#volunteer-management-wrapper .show button.fail").bind("click", function() {
		var row = $(this).parents(".card-part");
		row.remove();
		// TODO, for the server
	});


	/**
		For Page Project-verify
	**/
	// set status to be passed
	$("#project-verify-wrapper .show .card-part button.pass").bind("click", function() {
		var project = $(this).parents(".card-part").find(".for-id").text();
		// var rightpart = project.find(".right-part");
		// rightpart.children("button.fail").remove();
		// rightpart.children("textarea").remove();
		// rightpart.children("button.pass").text("已通过").removeClass("pass").addClass("passed");
		// $("#project-verify-wrapper #star_project .show .collection").append(project);
		$.ajax({
			url: "/superuser/examProject",
			type: "POST",
			data: {
				projectID: project,
				approve: 1,
				remark: ""
			}
		}).then(function(data){
			if (data && data.success) {
				location.reload();
			}
			else {
				alert("失败 " + (data ? data.message : "!"));
			}
		});
	});
	// set status to be failed
	$("#project-verify-wrapper .show .card-part button.fail").bind("click", function() {
		var projectID = $(this).parents(".card-part").find(".for-id").text();
		if($(this).next().css("display")=="none") {
			$(this).next().css("display", "block");
			$(this).text("提交");
		} else {
			var content = $(this).next().val();
			if(content !== "") {
				$.ajax({
					url: "/superuser/examProject",
					type: "POST",
					data: {
						projectID: projectID,
						approve: 3,
						remark: $("#reason-" + projectID).val()
					}
				}).then(function(data){
					if (data && data.success) {
						location.reload();
					}
					else {
						alert("失败 " + (data ? data.message : "!"));
					}
				});
			} 
		}
	});

});

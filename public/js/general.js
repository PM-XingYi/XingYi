$(function() {
	// search
	$("#search-box").hide();
	$("#search-icon").bind("mouseover", function() {
		$("#search-box").show();
		$("#search-box").animate({width:'160px'});
		$("#search-box").focus();
	});
	$("#search-box").bind("blur", function() {
		if($("#search-box").val()=="") {
			$("#search-box").animate({width:'0px'});
			$("#search-box").hide();
		}
	});
	// set the min-height of content
	$("#content").css("min-height", function() {
		return $(window).height()-$("header").height()-$("footer").height();
	});
	// slider
	$("#slider-2").hide();
	$("#slider-3").hide();
	// left or right one
	$(".showleft").bind("click", function() {
		var $current = $(".slider").filter(function() {
			return $(this).css("display")=="block";
		});
		var $prev = $current.index()==0?$(".slider").last():$current.prev();
		$current.fadeOut();
		$prev.fadeIn();
	});
	$(".showright").bind("click", function() {
		var $current = $(".slider").filter(function() {
			return $(this).css("display")=="block";
		});
		var $next = $current.index()==2?$(".slider").first():$current.next();
		$current.fadeOut();
		$next.fadeIn();
	});
	// auto change
	function showright() {
		var $current = $(".slider").filter(function() {
			return $(this).css("display")=="block";
		});
		var $next = $current.index()==2?$(".slider").first():$current.next();
		$current.fadeOut();
		$next.fadeIn();
	}
	setInterval(showright, 10000);
	//back to top
	$(".backtotop").hide();	
	$(window).bind("scroll", function() {
		if($(document).scrollTop()>0)
			$(".backtotop").show();
		else 
			$(".backtotop").hide();
	});
	$(".backtotop").bind("click", function() {
		$("html, body").animate({ scrollTop: 0 }, 120);
	});
	//render the progress bar
	$(".project-progress-complete").each(function() {
		var per = parseFloat($(this).text());
		var bar = $(this).next();
		var width = bar.width();
		var done = bar.children(":first");
		var undone = done.next();
		done.css("width", per*width);
		undone.css("width", (1-per)*width);
		var result = (per*100).toFixed(0) +"%";
		if(per>=0.5) {
			done.text(result);
		} else {
			undone.text(result);
		}
	});

	//For tab change
	$("#all_project_tab").addClass("active-tab");
	$("#star_project").css("display", "none");
	$("#join_project").css("display", "none");
	$("#all_project_tab").bind("click", function() {
		$(".filter").children(".active-tab").removeClass("active-tab");
		$("#all_project_tab").addClass("active-tab");
		$(".tab").css("display", "none");
		$("#all_project").css("display", "block");
	});
	$("#star_project_tab").bind("click", function() {
		$(".filter").children(".active-tab").removeClass("active-tab");
		$("#star_project_tab").addClass("active-tab");
		$(".tab").css("display", "none");
		$("#star_project").css("display", "block");
	});
	$("#join_project_tab").bind("click", function() {
		$(".filter").children(".active-tab").removeClass("active-tab");
		$("#join_project_tab").addClass("active-tab");
		$(".tab").css("display", "none");
		$("#join_project").css("display", "block");
	});

	//For Page Admin Comments Management
	$("#admin-comments-management-wrapper #check-all").bind("click", function() {
		if($(this).is(':checked')) {		// cancel checked
			$(".tab").filter(function() {
				return $(this).css("display")=="block";
			}).find(".collection").children(".row").filter(function() {
				return $(this).css("display")=="block";
			}).find(".check").each(function() {
				$(this).prop("checked", true);
			});
		} else {	// check
			$(".tab").filter(function() {
				return $(this).css("display")=="block";
			}).find(".collection").children(".row").filter(function() {
				return $(this).css("display")=="block";
			}).find(".check").each(function() {
				$(this).prop("checked", false);
			});
		}
	});

	// For Page view_details
	// timeline flags
	function days(starttime, endtime) {
		// because here we don't need an exact result,
		// so just suppose there are 30 days each month, and thus 360 days each year.
		var sm = parseInt(starttime[0]);
		var sd = parseInt(starttime[1]);
		var sy = parseInt(starttime[2]);
		var em = parseInt(endtime[0]);
		var ed = parseInt(endtime[1]);
		var ey = parseInt(endtime[2]);
		return (ey-sy)*360+(em-sm)*30+(ed-sd);
	}
	$(".project-event-show").children(".event").each(function() {
		var starttime = $("i.start-time").text().split("/");
		var endtime = $("i.end-time").text().split("/");
		var total = days(starttime, endtime);
		var currenttime = $(this).children("i").text().split("/");
		var diff = days(starttime, currenttime);
		var width = $(".timeline").width();
		var left = width*diff/total-20;		//the flag picture's width is 40..
		var html = "<div class='flag' style='left:"+left+"px'></div>";
		$(".timeline").append(html);
		$(this).css("display","none");
	});
	$(".flag").bind("click", function() {
		$(".flag").removeClass("flag-active");
		$(this).addClass("flag-active");
		$(".event").css("display", "none");
		$(".event").eq($(".flag").index($(this))).css("display", "block");
	});
	// show the lastest event
	var eventCount = $(".event").size();
	if(eventCount==0) {
		$(".project-event-show").css("display", "none");
	} else {
		$(".flag").eq(eventCount-1).click();
	}
	// then is for tab bar
	$("#view-details-wrapper .tab-bar").bind("click", function() {
		$("#view-details-wrapper .tab-bar-content").css("display", "none");
		$("#view-details-wrapper .tab-bar").removeClass("active-tab-bar");
		$(this).addClass("active-tab-bar");
		$("#view-details-wrapper .tab-bar-content").eq($(".tab-bar").index($(this))).css("display", "block");
	});
	$("#view-details-wrapper .tab-bar").eq(0).click();
	// check checkbox 
	$("#view-details-wrapper .tab-bar-content input[type='checkbox']").prop("checked", true);
	// this is for apply button, pop up
	$("#view-details-wrapper #apply").bind("click", function() {
		var windowHeight = $(window).height();
		var widthWidth = $(window).width();
		var popHeight = $("#apply-form").height();
		var popWidth = $("#apply-form").width();
		var popY = (windowHeight-popHeight)/2;
		var popX = (widthWidth-popWidth)/2;
		$("#apply-form").css("top", popY+$(document).scrollTop()).css("left", popX).fadeIn();
	});
	$("#view-details-wrapper #apply-form #cancel-apply").bind("click", function() {
		$("#apply-form").fadeOut();
	});
	//Donate section
	//Change progress bar
	$("#view-details-wrapper .donate-progress .progress-undone").css("background-color", "#f2f2f2");
	$("#view-details-wrapper .donate-status>section>label>i").text(function() {
		return parseFloat($("#view-details-wrapper .project-progress-complete").text())*parseFloat($("#view-details-wrapper .donate-progress label:last-child").text());
	});

	/*
		For Page View Participating User
	*/
	$("#view-participatingpjs-user-wrapper .show .collection").children(".project-wrapper").each(function() {
		var type = parseInt($(this).children("i").text());
		switch(type) {
			case 1:
				var html = "<img src='img/passed-flag.png' class='status-flag'>";
				break;
			case 2:
				var html = "<img src='img/pending-flag.png' class='status-flag'>";
				break;
			case 3:
				var html = "<img src='img/failed-flag.png' class='status-flag'>";
				break;
			default:
				var html = "";
		}
		$(this).append(html);
	});

	/*
		For Page View All Project Manager
	*/
	$("#view-all-project-manager-wrapper .show .collection").children(".project-wrapper").each(function() {
		var type = parseInt($(this).children("i").text());
		switch(type) {
			case 1:
				var html = "<img src='img/passed-flag.png' class='status-flag'>";
				html += "<div class='project-operate'><button class='rounded-button'>EDIT</button></div>";
				break;
			case 2:
				var html = "<img src='img/pending-flag.png' class='status-flag'>";
				html += "<div class='project-operate'><button class='rounded-button'>EDIT</button></div>";
				break;
			case 3:
				var html = "<img src='img/failed-flag.png' class='status-flag'>";
				html += "<div class='project-operate'><button class='rounded-button disable-button' disabled='disabled'>EDIT</button></div>";
				break;
			default:
				var html = "";
		}
		$(this).append(html);
	});

	/*
		For Page Create New Project Manager
	*/
	$("#create-new-project-manager-wrapper .fold").each(function() {
		$(this).parents(".row").nextAll().fadeOut();  
	});
	$("#create-new-project-manager-wrapper .fold").bind("click", function() {
		var ele = $(this).parents(".row").next();
		if(ele.css("display")=="none")
			$(this).parents(".row").nextAll().fadeIn();
		else
			$(this).parents(".row").nextAll().fadeOut();
	});
	$("#create-new-project-manager-wrapper .input-file input[type='file']").change(function() {
		$(".input-file+label").text($(this).val());
	});

	/*
		For Volunteer Manage
	*/
	$("#volunteer-management-wrapper .show-result").eq(1).css("display", "none");

	$("#volunteer-management-wrapper #all_project_tab").bind("click", function() {
		$("#volunteer-management-wrapper .show-result").css("display", "none");
		$("#volunteer-management-wrapper .show-result").eq(0).css("display", "block");	
	});
	
	$("#volunteer-management-wrapper #star_project_tab").bind("click", function() {
		$("#volunteer-management-wrapper .show-result").css("display", "none");
		$("#volunteer-management-wrapper .show-result").eq(1).css("display", "block");	
	});

	/**
		For Page Project-verify
	**/
	// set status to be passed
	$("#project-verify-wrapper .show-result").eq(1).css("display", "none");
	$("#project-verify-wrapper .show-result").eq(2).css("display", "none");
	$("#project-verify-wrapper #all_project_tab").bind("click", function() {
		$("#project-verify-wrapper .show-result").css("display", "none");
		$("#project-verify-wrapper .show-result").eq(0).css("display", "block");	
	});
	$("#project-verify-wrapper #star_project_tab").bind("click", function() {
		$("#project-verify-wrapper .show-result").css("display", "none");
		$("#project-verify-wrapper .show-result").eq(1).css("display", "block");	
	});
	$("#project-verify-wrapper #join_project_tab").bind("click", function() {
		$("#project-verify-wrapper .show-result").css("display", "none");
		$("#project-verify-wrapper .show-result").eq(2).css("display", "block");	
	});

});

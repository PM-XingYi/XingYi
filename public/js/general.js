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
		var result = per*100+"%";
		if(per>=0.5) {
			done.text(result);
		} else {
			undone.text(result);
		}
	});
});
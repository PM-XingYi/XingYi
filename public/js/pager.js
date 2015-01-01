$(function() {
	var show_per_page = parseInt($("#page_navigation #show_per_page").val());
	var number_of_items = $(".show .collection").children().size();
	var number_of_pages = Math.ceil(number_of_items/show_per_page);
	$("#current_page").val(0);
	var navigation_html = '<a class="previous_link">Prev</a>';
	var current_link = 0;
	while(number_of_pages > current_link){
		navigation_html += '<a class="page_link" longdesc="' + current_link +'">'+ (current_link + 1) +'</a>';
		current_link++;
	}
	navigation_html += '<a class="next_link">Next</a>';
	$('#page_navigation').append(navigation_html);
	$('#page_navigation .page_link:first').addClass('active_page');

	//$('.show .collection').children().css('display', 'none');
	//$('.show .collection').children().slice(0, show_per_page).css('display', 'block');

	$("#page_navigation .next_link").bind("click", function() {
		next();
	});

	$("#page_navigation .previous_link").bind("click", function() {
		previous();
	});

	$("#page_navigation .page_link").bind("click", function() {
		var index = parseInt($(this).text());
		go_to_page(index-1);
	});

	function previous(){
		new_page = parseInt($('#current_page').val()) - 1;
		//if there is an item before the current active link run the function
		if($('.active_page').prev('.page_link').length==true){
			go_to_page(new_page);
		}
	}

	function next(){
		new_page = parseInt($('#current_page').val()) + 1;
		//if there is an item after the current active link run the function
		if($('.active_page').next('.page_link').length==true){
			go_to_page(new_page);
		}
	}

	function go_to_page(page_num){
		//get the number of items shown per page
		var show_per_page = parseInt($("#page_navigation #show_per_page").val());
		//get the element number where to start the slice from
		start_from = page_num * show_per_page;
		//get the element number where to end the slice
		end_on = start_from + show_per_page;
		//hide all children elements of content div, get specific items and show them
		$('.show .collection').children().css('display', 'none');
		$('.show .collection').children().slice(start_from, end_on).css('display', 'block');
		/*get the page link that has longdesc attribute of the current page and add active_page class to it
		and remove that class from previously active page link*/
		$('.page_link[longdesc=' + page_num +']').addClass('active_page').siblings('.active_page').removeClass('active_page');
		//update the current page input field
		$('#current_page').val(page_num);
	}

});

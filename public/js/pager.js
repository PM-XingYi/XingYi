$(function() {
	$(".page_navigation").each(function() {
		var content = $(this).prev(".show").find(".collection");
		var show_per_page = parseInt($(".show_per_page", this).val());
		var number_of_items = content.children().size();
		var number_of_pages = Math.ceil(number_of_items/show_per_page);
		
		$(".current_page", this).val(0);
		var navigation_html = '<a class="previous_link">Prev</a>';
		var current_link = 0;
		while(number_of_pages > current_link){
			navigation_html += '<a class="page_link" longdesc="' + current_link +'">'+ (current_link + 1) +'</a>';
			current_link++;
		}
		navigation_html += '<a class="next_link">Next</a>';
		if(current_link==0) {
			navigation_html = "";
		}
		$(this).append(navigation_html);
		$(".page_link:first", this).addClass('active_page');
		content.children().css('display', 'none');
		content.children().slice(0, show_per_page).css('display', 'block');

		$(".previous_link", this).bind("click", function() {
			previous($(this).parent());
		});

		$(".next_link", this).bind("click", function() {
			next($(this).parent());
		});

		$(".page_link", this).bind("click", function() {
			var index = parseInt($(this).text());
			go_to_page(index-1, $(this).parent());
		});
	});

	function previous(obj){
		new_page = parseInt($('.current_page', obj).val()) - 1;
		//if there is an item before the current active link run the function
		if($('.active_page', obj).prev('.page_link').length==true){
			go_to_page(new_page, obj);
		}
	}

	function next(obj){
		new_page = parseInt($('.current_page', obj).val()) + 1;
		//if there is an item after the current active link run the function
		if($('.active_page', obj).next('.page_link').length==true){
			go_to_page(new_page, obj);
		}
	}

	function go_to_page(page_num, obj){
		var content = obj.prev(".show").find(".collection");
		//get the number of items shown per page
		var show_per_page = parseInt($(".show_per_page", obj).val());
		//get the element number where to start the slice from
		start_from = page_num * show_per_page;
		//get the element number where to end the slice
		end_on = start_from + show_per_page;
		//hide all children elements of content div, get specific items and show them
		content.children().css('display', 'none');
		content.children().slice(start_from, end_on).css('display', 'block');
		//get the page link that has longdesc attribute of the current page and add active_page class to it
		//and remove that class from previously active page link
		$('.page_link[longdesc=' + page_num +']', obj).addClass('active_page').siblings('.active_page').removeClass('active_page');
		//update the current page input field
		$('.current_page', obj).val(page_num);
	}

});

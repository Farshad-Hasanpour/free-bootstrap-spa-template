$(document).ready(function(){
	const numberOfPlants = 46;
	$('.page1').animate({opacity: '1'}, 1000);
	loadPage(true);
	cardsContainerResize();
	contentMinHeight();
	gotTopButton();

	function scrollToTop(){
		$('html,body').animate({scrollTop:0}, 1000);
	}
	
	$(window).resize(function(){
		cardsContainerResize();
		lastCardSize();
		contentMinHeight();
	});

	$(window).scroll(gotTopButton);

	$('.card-img-top').on('load', function(){
		$(this).removeClass('loading');
	});

	$('#side-contact-us-button, #top-contact-us-button').on('click',function(){
		$('html, body').animate({
            scrollTop: $("#contact-us").offset().top
        }, 1000);
	});         

	$('#more-button').on('click',function(){
		if(isPageVisible(4)){
			// Do Nothing this button should be hidden already
			$('#more').hide(); // try again to make load more button hidden
		}else if(isPageVisible(3)){
			makePageVisible(4);
			$('#more').hide(); // make load more button hidden
		}else if(isPageVisible(2)){
			makePageVisible(3);
		}else if(isPageVisible(1)){
			makePageVisible(2);
		}
	});

	$('.nav-link:not(.contact-us-button)').on('click', loadPage);

	$('#go-top-button').on('click', scrollToTop);

	$('#content').on('click', '.card-title a, #next-plant, #prev-plant', function(){
		// Number 0 makes scroll to top when page is reloaded or ajax is called
		history.replaceState({}, 'قالب رایگان', '?number=0');
		
		var plantId = $(this).attr('data-plant-id');
		if(plantId < 1 || plantId > numberOfPlants) return;

		const plantIndex = "plant" + plantId;
		//TODO: Read data from json based on id
		var image_source = plants[plantIndex]["image_source"] || "image/transparent-brand.png";
		var prev = plants[plantIndex]["prev"] || 0;
		var next = plants[plantIndex]["next"] || 0;
		var persian_name = plants[plantIndex]["persian_name"] || "";
		var scientific_name = plants[plantIndex]["scientific_name"] || "";
		var type_of_cover = plants[plantIndex]["type_of_cover"] || "";
		var taking_care = plants[plantIndex]["taking_care"] || "";
		var application = plants[plantIndex]["application"] || "";

		$.get('ajax/plant-details.html', function(data){
  			// Remove all children of #content except #more button
  			$("#content > *:not(#more)").remove();
  			$('#content #more').css({display: 'none'});
  			
  			// Put data in plant-detail.html
  			data = $.parseHTML(data);
			$(data).find('#details-image').attr('src', image_source);
			$(data).find('#prev-plant').attr('data-plant-id', prev);
			$(data).find('#next-plant').attr('data-plant-id', next);
			$(data).find('#plant-description');
			$(data).find('#next-plant').parent().next().html(persian_name + '<span class="en-text">('+scientific_name+')</span>');
  			$(data).find('#type-of-cover').html('<span class="bold">نوع پوشش: </span>'+type_of_cover);
  			$(data).find('#taking-care').html('<span class="bold">مراقبت ویژه: </span>'+taking_care);
  			$(data).find('#application').html('<span class="bold">کاربرد اختصاصی در فضای سبز شهری: </span>'+application);

  			// Add data to #content before #more button
  			$(data).insertBefore("#content #more");
  			
  		});

		// scroll to top
		if($(this).attr('data-scroll-top') !== 'no'){
			scrollToTop();
		}
  		
  		// Force active plants nav-link
  		$('#slider-nav .nav-item .nav-link.active, #sidebar-replacement > .nav-item .nav-link.active').removeClass('active');
		$('#top-plants-link, #plants-link').addClass('active');
	});

	$('#content').on('click', '#plant-list', function(){
		$.get( "ajax/plants-page1.html", function(data) {
  			// Button will be hidden instead of removed because there is an event listener for this button
  			// decide whether Load More Button should be displayed or not

  			// Remove all childs of #content except #more button
  			$("#content > :not(#more)").remove();
  			
  			// Add data to #content before #more button
  			$(data).insertBefore("#content #more");
  			$('#content #more').css({display:'flex'});
  			$('.page1').animate({opacity: '1'}, 1000);
  		});
  		history.replaceState({}, 'قالب رایگان', '?');
		scrollToTop();
	});

	function cardsContainerResize(){
		if(window.innerWidth <= 768/* || (window.innerWidth > 768 && window.innerHeight < 380)*/){
			$('.cards-container').addClass('col-12').removeClass('col-10');
		}else{
			$('.cards-container').addClass('col-10').removeClass('col-12');
		}
	}

	function isPageVisible(number){
		var pageClass = '.page1';
		if(number == 2){
			pageClass = '.page2';
		}else if(number == 3){
			pageClass = '.page3';
		}else if(number == 4){
			pageClass = '.page4';
		}else{
			return 'page not found';
		}

		if ($('#content ' + pageClass).is(':visible')) return true;
		return false;
	}

	function makePageVisible(number){
		let pageClass = 'page1';
		if(number == 2){
			pageClass = 'page2';
		}else if(number == 3){
			pageClass = 'page3';
		}else if(number == 4){
			pageClass = 'page4';
		}else{
			return 'page not found';
		}
		
		// Get plants page using ajax
		$.get('ajax/plants-' + pageClass+'.html', function(data){
			$(data).insertBefore("#content #more");
			$('.' + pageClass).css({display:"flex"});
			$('.' + pageClass).animate({opacity: '1'}, 1000);
			//Set size of last card
			lastCardSize();
			// Edit URL without loading it
			window.history.replaceState({}, 'قالب رایگان', '?number=' + pageClass.substring(4, 5));
		});
	}

	function getUrlParameter(sParam) {
	    let sPageURL = decodeURIComponent(window.location.search.substring(1)),
	        sURLVariables = sPageURL.split('&'),
	        sParameterName,
	        i;

	    for (i = 0; i < sURLVariables.length; i++) {
	        sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] === sParam) {
	            return sParameterName[1] === undefined ? true : sParameterName[1];
	        }
	    }
	}

	function contentMinHeight(){
		$('#content').css({'min-height': window.innerHeight });
	}

	function gotTopButton(){
		const button = $('#go-top-button');
		if($(this).scrollTop() > (window.innerHeight / 1.5)) button.show();
		else button.hide();
	}

	function loadPage(redirect = false){
		let $e;
		let $e_other; // second nav
		let pageName;

		if(redirect){
			$e = $("#" + getUrlParameter('page')+"-link");
			$e_other = $("#top-" + getUrlParameter('page') + "-link");
			pageName = $e.attr('data-page');
		}else{
			$e = $(this);
			pageName = $e.attr('data-page');

			// Find other (hidden) nav
			if($(this).attr('id').substring(0, 3) === 'top' ){
				// other nav is side nav
				$e_other = $('.nav .nav-item .nav-link[data-page="'+ pageName +'"]');
			}else{
				//other nav is top navbar
				$e_other = $('#sidebar-replacement #navbarSupportedContent .navbar-nav .nav-item .nav-link[data-page="'+ pageName +'"]');
			}
		}

		// if pageName is not provided OR clickep page is currently active
		let currentAvtive = $e.closest('.nav, .navbar-nav').find('.active');
		let pageToActivate = $e;

		// other (hidden) nav
		let current = $e_other.closest('.nav, .navbar-nav').find('.active');
		let activate = $e_other;

		if(!pageName){
			const number = getUrlParameter('number');
			// if page is reloaded in sections more than 1
			if(number == 0 || number == 2 || number == 3 || number == 4){
				history.replaceState({}, 'قالب رایگان', '?');
				scrollToTop();
			}
			//cancel event
			return;
		}else if(currentAvtive.attr('data-page') == pageToActivate.attr('data-page')){
			scrollToTop();
			// Edit browse Url
			let page = pageName.substring(0, pageName.indexOf('.'));
			// chage URL without loading url
			history.replaceState({}, 'قالب رایگان', page.substring(0, 6) === 'plants' ? '?' : '?page=' + page);
			return;
		}

		// Get and Set Content
		$.get( "ajax/" + pageName, function(data) {
  			// Remove all children of #content except #more button
  			$("#content > :not(#more)").remove();
  			
  			// Add data to #content before #more button
  			$(data).insertBefore("#content #more");
  			if(pageName !== 'plants-page1.html'){
  				$('#content #more').css({display:'none'});
  			}else{
  				$('#content #more').css({display:'flex'});
  				$('.page1').animate({opacity: '1'}, 1000);
  			}  			
  			
  			// Set sidebar nav
  			pageToActivate.addClass('active');
  			currentAvtive.removeClass('active');
		
  			// Set other (hidden) nav
  			activate.addClass('active');
  			current.removeClass('active');
		});

		scrollToTop();
		// Edit browse Url
		let page = pageName.substring(0, pageName.indexOf('.'));
		// change URL without loading url
		history.replaceState({}, 'قالب رایگان', page.substring(0, 6) === 'plants' ? '?' : '?page=' + page);
	}

	function lastCardSize(){
		const $lastCard = $('#last-card');
		if(!$lastCard) return;
		$lastCard.css({
			'max-width': $lastCard.parent().prev().find('.card:first').width()
		});
	}

	document.getElementById('this-year').innerHTML = new Date().getFullYear();
});
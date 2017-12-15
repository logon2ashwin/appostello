;(function () {
	
	'use strict';
	// slider func
	var $$ = function(selector, context) {
		var context = context || document;
		var elements = context.querySelectorAll(selector);
		return [].slice.call(elements);
	  };
	
	  function _fncSliderInit($slider, options) {
		var prefix = ".fnc-";
	
		var $slider = $slider;
		var $slidesCont = $slider.querySelector(prefix + "slider__slides");
		var $slides = $$(prefix + "slide", $slider);
		var $controls = $$(prefix + "nav__control", $slider);
		var $controlsBgs = $$(prefix + "nav__bg", $slider);
		var $progressAS = $$(prefix + "nav__control-progress", $slider);
	
		var numOfSlides = $slides.length;
		var curSlide = 1;
		var sliding = false;
		var slidingAT = +parseFloat(getComputedStyle($slidesCont)["transition-duration"]) * 1000;
		var slidingDelay = +parseFloat(getComputedStyle($slidesCont)["transition-delay"]) * 1000;
	
		var autoSlidingActive = false;
		var autoSlidingTO;
		var autoSlidingDelay = 5000; // default autosliding delay value
		var autoSlidingBlocked = false;
	
		var $activeSlide;
		var $activeControlsBg;
		var $prevControl;
	
		function setIDs() {
		  $slides.forEach(function($slide, index) {
			$slide.classList.add("fnc-slide-" + (index + 1));
		  });
	
		  $controls.forEach(function($control, index) {
			$control.setAttribute("data-slide", index + 1);
			$control.classList.add("fnc-nav__control-" + (index + 1));
		  });
	
		  $controlsBgs.forEach(function($bg, index) {
			$bg.classList.add("fnc-nav__bg-" + (index + 1));
		  });
		};
	
		setIDs();
	
		function afterSlidingHandler() {
		  $slider.querySelector(".m--previous-slide").classList.remove("m--active-slide", "m--previous-slide");
		  $slider.querySelector(".m--previous-nav-bg").classList.remove("m--active-nav-bg", "m--previous-nav-bg");
	
		  $activeSlide.classList.remove("m--before-sliding");
		  $activeControlsBg.classList.remove("m--nav-bg-before");
		  $prevControl.classList.remove("m--prev-control");
		  $prevControl.classList.add("m--reset-progress");
		  var triggerLayout = $prevControl.offsetTop;
		  $prevControl.classList.remove("m--reset-progress");
	
		  sliding = false;
		  var layoutTrigger = $slider.offsetTop;
	
		  if (autoSlidingActive && !autoSlidingBlocked) {
			setAutoslidingTO();
		  }
		};
	
		function performSliding(slideID) {
		  if (sliding) return;
		  sliding = true;
		  window.clearTimeout(autoSlidingTO);
		  curSlide = slideID;
	
		  $prevControl = $slider.querySelector(".m--active-control");
		  $prevControl.classList.remove("m--active-control");
		  $prevControl.classList.add("m--prev-control");
		  $slider.querySelector(prefix + "nav__control-" + slideID).classList.add("m--active-control");
	
		  $activeSlide = $slider.querySelector(prefix + "slide-" + slideID);
		  $activeControlsBg = $slider.querySelector(prefix + "nav__bg-" + slideID);
	
		  $slider.querySelector(".m--active-slide").classList.add("m--previous-slide");
		  $slider.querySelector(".m--active-nav-bg").classList.add("m--previous-nav-bg");
	
		  $activeSlide.classList.add("m--before-sliding");
		  $activeControlsBg.classList.add("m--nav-bg-before");
	
		  var layoutTrigger = $activeSlide.offsetTop;
	
		  $activeSlide.classList.add("m--active-slide");
		  $activeControlsBg.classList.add("m--active-nav-bg");
	
		  setTimeout(afterSlidingHandler, slidingAT + slidingDelay);
		};
	
	
	
		function controlClickHandler() {
		  if (sliding) return;
		  if (this.classList.contains("m--active-control")) return;
		  if (options.blockASafterClick) {
			autoSlidingBlocked = true;
			$slider.classList.add("m--autosliding-blocked");
		  }
	
		  var slideID = +this.getAttribute("data-slide");
	
		  performSliding(slideID);
		};
	
		$controls.forEach(function($control) {
		  $control.addEventListener("click", controlClickHandler);
		});
	
		function setAutoslidingTO() {
		  window.clearTimeout(autoSlidingTO);
		  var delay = +options.autoSlidingDelay || autoSlidingDelay;
		  curSlide++;
		  if (curSlide > numOfSlides) curSlide = 1;
	
		  autoSlidingTO = setTimeout(function() {
			performSliding(curSlide);
		  }, delay);
		};
	
		if (options.autoSliding || +options.autoSlidingDelay > 0) {
		  if (options.autoSliding === false) return;
		  
		  autoSlidingActive = true;
		  setAutoslidingTO();
		  
		  $slider.classList.add("m--with-autosliding");
		  var triggerLayout = $slider.offsetTop;
		  
		  var delay = +options.autoSlidingDelay || autoSlidingDelay;
		  delay += slidingDelay + slidingAT;
		  
		  $progressAS.forEach(function($progress) {
			$progress.style.transition = "transform " + (delay / 1000) + "s";
		  });
		}
		
		$slider.querySelector(".fnc-nav__control:first-child").classList.add("m--active-control");
	
	  };
	
	  var fncSlider = function(sliderSelector, options) {
		var $sliders = $$(sliderSelector);
	
		$sliders.forEach(function($slider) {
		  _fncSliderInit($slider, options);
		});
	  };
	
	  window.fncSlider = fncSlider;
	}());
	
	/* not part of the slider scripts */
	
	/* Slider initialization
	options:
	autoSliding - boolean
	autoSlidingDelay - delay in ms. If audoSliding is on and no value provided, default value is 5000
	blockASafterClick - boolean. If user clicked any sliding control, autosliding won't start again
	*/
	fncSlider(".example-slider", {autoSlidingDelay: 4000});
	
	var $demoCont = document.querySelector(".demo-cont");
	
	[].slice.call(document.querySelectorAll(".fnc-slide__action-btn")).forEach(function($btn) {
	  $btn.addEventListener("click", function() {
		$demoCont.classList.toggle("credits-active");
	  });
	});
	
	document.querySelector(".demo-cont__credits-close").addEventListener("click", function() {
	  $demoCont.classList.remove("credits-active");
	});
	
	document.querySelector(".js-activate-global-blending").addEventListener("click", function() {
	  document.querySelector(".example-slider").classList.toggle("m--global-blending-active");
	// end of slider func



	// iPad and iPod detection	
	var isiPad = function(){
		return (navigator.platform.indexOf("iPad") != -1);
	};

	var isiPhone = function(){
	    return (
			(navigator.platform.indexOf("iPhone") != -1) || 
			(navigator.platform.indexOf("iPod") != -1)
	    );
	};

	var fullHeight = function() {
		if ( !isiPad() || !isiPhone() ) {
			$('.js-fullheight-home').css('height', $(window).height() - $('.fh5co-main-nav').height());
			$(window).resize(function(){
				$('.js-fullheight-home').css('height', $(window).height()  - $('.fh5co-main-nav').height());
			})
		}
	};

	// Loading page
	var loaderPage = function() {
		$(".fh5co-loader").fadeOut("slow");
	};

	var fh5coTabs = function() {
		// $('.fh5co-tabs-container').
		$('.fh5co-tabs li a').click(function(event){
			event.preventDefault();
			var $this = $(this),
				tab = $this.data('tab');
				$('.fh5co-tabs li').removeClass('active');
				$this.closest('li').addClass('active');
				$this.closest('.fh5co-tabs-container').find('.fh5co-tab-content').removeClass('active');
				$this.closest('.fh5co-tabs-container').find('.fh5co-tab-content[data-tab-content="'+tab+'"]').addClass('active');
		});
	}

	var gridAutoHeight = function() {
		if (!isiPhone() || !isiPad()) {
			$('.fh5co-grid-item').css('height', $('.fh5co-2col-inner').outerHeight()/2);
		}
		$(window).resize(function(){
			if (!isiPhone() && !isiPad()) {
				$('.fh5co-grid-item').css('height', $('.fh5co-2col-inner').outerHeight()/2);
			}
		});
	}

	var sliderSayings = function() {
		$('#fh5co-sayings .flexslider').flexslider({
			animation: "slide",
			slideshowSpeed: 5000,
			directionNav: false,
			controlNav: true,
			smoothHeight: true,
			reverse: true
	  	});
	}

	var offcanvasMenu = function() {
		$('body').prepend('<div id="fh5co-offcanvas" />');
		$('body').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle"><i></i></a>');

		$('.fh5co-main-nav .fh5co-menu-1 a, .fh5co-main-nav .fh5co-menu-2 a').each(function(){

			var $this = $(this);

			$('#fh5co-offcanvas').append($this.clone());

		});
		// $('#fh5co-offcanvas').append
	};

	var mainMenuSticky = function() {
		
		var sticky = $('.js-sticky');

		sticky.css('height', sticky.height());
		$(window).resize(function(){
			sticky.css('height', sticky.height());
		});

		var $section = $('.fh5co-main-nav');
		
		$section.waypoint(function(direction) {
		  	
		  	if (direction === 'down') {

			    	$section.css({
			    		'position' : 'fixed',
			    		'top' : 0,
			    		'width' : '100%',
			    		'z-index' : 99999
			    	}).addClass('fh5co-shadow');;

			}

		}, {
	  		offset: '0px'
		});

		$('.js-sticky').waypoint(function(direction) {
		  	if (direction === 'up') {
		    	$section.attr('style', '').removeClass('fh5co-shadow');
		  	}
		}, {
		  	offset: function() { return -$(this.element).height() + 69; }
		});

	};
	
	// Parallax
	var parallax = function() {

		// $(window).stellar();
		if (!isiPhone() || isiPad() ) {
 			$(window).stellar({ horizontalScrolling: false });
 		}

	};


	// Burger Menu
	var burgerMenu = function() {

		$('body').on('click', '.js-fh5co-nav-toggle', function(event){

			var $this = $(this);

			if( $('body').hasClass('offcanvas-visible') ) {
				$('body').removeClass('offcanvas-visible fh5co-overflow');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-visible fh5co-overflow');
				$this.addClass('active');
			}

			event.preventDefault();

		});

	};

	var scrolledWindow = function() {

		$(window).scroll(function(){

			var scrollPos = $(this).scrollTop();

			
		   if ( $('body').hasClass('offcanvas-visible') ) {
		   	$('body').removeClass('offcanvas-visible');
		   	$('.js-fh5co-nav-toggle').removeClass('active');
		   }

		});

		$(window).resize(function() {
			if ( $('body').hasClass('offcanvas-visible') ) {
		   	$('body').removeClass('offcanvas-visible');
		   	$('.js-fh5co-nav-toggle').removeClass('active');
		   }
		});
		
	};

	// Click outside of offcanvass
	var mobileMenuOutsideClick = function() {

		$(document).click(function (e) {
	    var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {

	    	if ( $('body').hasClass('offcanvas-visible') ) {

    			$('body').removeClass('offcanvas-visible');
    			$('.js-fh5co-nav-toggle').removeClass('active');
				
	    	}
	    
	    	
	    }
		});

	};

	var goToTop = function() {

		$('.js-gotop').on('click', function(event){
			
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');
			
			return false;
		});

		$(window).scroll(function(){

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});
	
	};


	// Page Nav
	var clickMenu = function() {
		var topVal = ( $(window).width() < 769 ) ? 0 : 58;

		$(window).resize(function(){
			topVal = ( $(window).width() < 769 ) ? 0 : 58;		
		});
		$('.fh5co-main-nav a:not([class="external"]), #fh5co-offcanvas a:not([class="external"]), a.fh5co-content-nav:not([class="external"])').click(function(event){
			var section = $(this).data('nav-section');

				if ( $('div[data-section="' + section + '"]').length ) {

					$('html, body').animate({
			        	scrollTop: $('div[data-section="' + section + '"]').offset().top - topVal
			    	}, 500, 'easeInOutExpo');	
			    	
			   }

		    event.preventDefault();

		    // return false;
		});


	};

	// Reflect scrolling in navigation
	var navActive = function(section) {
		
		$('.fh5co-main-nav a[data-nav-section], #fh5co-offcanvas a[data-nav-section]').removeClass('active');
		$('.fh5co-main-nav, #fh5co-offcanvas').find('a[data-nav-section="'+section+'"]').addClass('active');
		
	};

	var navigationSection = function() {

		var $section = $('div[data-section]');
		
		$section.waypoint(function(direction) {
		  	if (direction === 'down') {
		    	navActive($(this.element).data('section'));
		  	}

		}, {
	  		offset: '150px'
		});

		$section.waypoint(function(direction) {
		  	if (direction === 'up') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
		  	offset: function() { return -$(this.element).height() + 155; }
		});

	};


	


	// Document on load.
	$(function(){

		fullHeight();
		loaderPage();
		fh5coTabs();
		gridAutoHeight();

		// sliderMain();
		// sliderSayings();
		offcanvasMenu();
		mainMenuSticky();
		parallax();
		burgerMenu();
		scrolledWindow();
		mobileMenuOutsideClick();
		clickMenu();
		navigationSection();
		goToTop();

	});


}());


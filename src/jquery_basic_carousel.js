(function($){
	$.fn.basicCarousel = function(options){
		// Variable declaration
		// Images set, image wrapper, image marker
		// current instance variable retainer, first image
		// setInterval holder, slide duration	
		var $images = this.find("img"),
			$wrapper = this.find(".image-wrapper"),
			$imageMarker = this.append("<ul class='marker-wrapper'><li class='active-marker'></li></ul>").find('.marker-wrapper'),
			$prev_this = this,
			$firstImage = $($images[0]),
			timer = null,
			duration = !!options ? options.duration : 3000;

		// Set first image as the active
		$firstImage.addClass("active");

		// Set the wrapper to be the height and width of the first image
		// Assumtion, all images will be of equal resolution
		$wrapper.css({
			width: $firstImage.width() + "px",
			height: $firstImage.height() + "px"
		});

		// Set the top and left css of all the images except for the first image
		// and append LIs to represent each image
		for(var i = 1; i < $images.length; i++){
			$($images[i]).css({
				left: $($images[i]).width() * i + "px"
			});

			$imageMarker.append("<li>");
		};

		// Set width of image marker UL
		// and center align LIs with respect to the image carousel
		$imageMarker.css({
			width: $firstImage.width() + "px"
		}).find("li:first-child").css({
			marginLeft: (($firstImage.width() - ($imageMarker.children().length * 10)) / 2) + "px"
		});

		// Function
		// Reset the setInterval timer
		var resetTimer = function(){
			clearInterval(timer);
			timer = setInterval(forward, duration);
		};

		// Function
		// Initiate forward slide show of the images (Right to Left)
		var forward = function(){
			// Variables
			// Currently active image, next image in the queue,
			// currently active marker, next marker
			var $active = $prev_this.find(".active"),
				$next = $active.next().length === 0 ? $($images[0]) : $active.next(),
				$activeMarker = $prev_this.find(".active-marker"),
				$nextMarker = $activeMarker.next().length === 0 ? $imageMarker.find("li:first-child") : $activeMarker.next();

			// Function Callbacks
			transistionCallback($active, $next, "-"+ $active.width() +"px", + $next.width() +"px", $activeMarker, $nextMarker);
			resetTimer();
		};

		// Function
		// Initiate backward slide show of the images (Left to Right)
		var backward = function(){
			// Variables
			// Currently active image, previous image in the queue,
			// currently active marker, next marker
			var $active = $prev_this.find(".active"),
				$prev = $active.prev().length === 0 ? $($images[$images.length - 1]) : $active.prev(),
				$activeMarker = $prev_this.find(".active-marker"),
				$prevMarker = $activeMarker.prev().length === 0 ? $imageMarker.find("li:last-child") : $activeMarker.prev();

			// Function Callbacks
			transistionCallback($active, $prev, $active.width() +"px", "-"+ $prev.width() +"px", $activeMarker, $prevMarker);
			resetTimer();
		};

		// Function
		// Arguments: Current active element, next element, current left postion, next left position,
		// 			currently active marker, next marker
		//
		// Callback to perform the slide animation of the images
		var transistionCallback = function($currentEle, $nextEle, left_current, left_next, $currentMarker, $nextMarker){
			// Current element animation
			$currentEle.removeClass("active")
				.stop().animate({
					left: left_current
				}, {
					duration: 500,
					easing: "linear"
			});

			// Next element animation
			$nextEle.css({
				left: left_next,
			}).addClass("active").stop().animate({
				left: "0"
			}, {
				duration: 500,
				easing: "linear"
			});

			// Toggle active-marker
			$currentMarker.removeClass("active-marker");
			$nextMarker.addClass("active-marker");
		};

		// Event
		// Event to handle the arrow based image change
		$(document).on("keydown", function(event){
			// Check if left arrow is pressed
			if(event.keyCode === 37){
				backward();
			};

			// Check if right arrow is pressed
			if(event.keyCode === 39){
				forward();
			};
		});

		// Set internval to perform auto slide show of images
		timer = setInterval(forward, duration);

		return this;
	};
})(jQuery);
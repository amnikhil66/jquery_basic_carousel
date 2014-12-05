(function($){
	$.fn.basicCarousel = function(options){
		// Variables
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
		// Assumption, all images will be of equal resolution
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
		// Arguments: index(optional)
		//
		// Initiate forward slide show of the images (Right to Left)
		var forward = function(index){
			// Variables
			// Currently active image, next image in the queue,
			// currently active marker, next marker
			var $active = $prev_this.find(".active"),
				$next = index >= 0 ? $prev_this.find(".image-wrapper img:eq(" + index + ")") : ($active.next().length === 0 ? $($images[0]) : $active.next()),
				$activeMarker = $prev_this.find(".active-marker"),
				$nextMarker = index >= 0 ? $prev_this.find(".marker-wrapper li:eq(" + index + ")") : ($activeMarker.next().length === 0 ? $imageMarker.find("li:first-child") : $activeMarker.next());

			// Function Callbacks
			transistionCallback($active, $next, "-"+ $active.width() +"px", + $next.width() +"px", $activeMarker, $nextMarker);
			resetTimer();
		};

		// Function
		// Arguments: index(optional)
		//
		// Initiate backward slide show of the images (Left to Right)
		var backward = function(index){
			// Variables
			// Currently active image, previous image in the queue,
			// currently active marker, next marker
			var $active = $prev_this.find(".active"),
				$prev = index >= 0 ? $prev_this.find(".image-wrapper img:eq(" + index + ")") : ($active.prev().length === 0 ? $($images[$images.length - 1]) : $active.prev()),
				$activeMarker = $prev_this.find(".active-marker"),
				$prevMarker = index >= 0 ? $prev_this.find(".marker-wrapper li:eq(" + index + ")") : ($activeMarker.prev().length === 0 ? $imageMarker.find("li:last-child") : $activeMarker.prev());

			// Function Callbacks
			transistionCallback($active, $prev, $active.width() +"px", "-"+ $prev.width() +"px", $activeMarker, $prevMarker);
			resetTimer();
		};

		// Function
		// Arguments: Current active element, next element, current left postion, next left position,
		// 			  currently active marker, next marker
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

		// Function
		// Initiate navigation based onclick of the marker
		var markerClick = function(event){
			// Variables
			// Target marker's index postion with respect to its parent
			// Active image's index postion with respect to its parent
			var target_marker_index = $(event.currentTarget).index(),
				active_index = $prev_this.find(".active").index();

			if(target_marker_index > active_index){
				forward(target_marker_index);
			}else{
				backward(target_marker_index);
			}
		};

		// Event
		// Handle the onclick event of the markers
		$prev_this.on("click", ".marker-wrapper li:not(.active-marker)", markerClick);

		// Event
		// Handle the arrow based image change
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
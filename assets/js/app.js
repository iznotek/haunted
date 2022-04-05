$(document).ready(function () {
	// Mobile Menu Trigger
	$('.gh-burger').click(function () {
		$('body').toggleClass('gh-head-open');
	});
});

var $carousel = $('.carousel').flickity({
  imagesLoaded: true,
  percentPosition: false,
  arrowShape: {
    x0: 10,
    x1: 60, y1: 50,
    x2: 0, y2: 5,
    x3: 90
  },
});

var $imgs = $carousel.find('.carousel-cell img');
// get transform property
var docStyle = document.documentElement.style;
var transformProp = typeof docStyle.transform == 'string' ?
  'transform' : 'WebkitTransform';
// get Flickity instance
var flkty = $carousel.data('flickity');

$carousel.on( 'scroll.flickity', function() {
  flkty.slides.forEach( function( slide, i ) {
    var img = $imgs[i];
    var x = ( slide.target + flkty.x ) * -1/3;
    img.style[ transformProp ] = 'translateX(' + x  + 'px)';
  });
});

const images = document.querySelectorAll('.kg-image-card img, .kg-gallery-card img');

// Lightbox function
images.forEach(function (image) {
  var wrapper = document.createElement('a');
  wrapper.setAttribute('data-no-swup', '');
  wrapper.setAttribute('data-fslightbox', 'gallery');
  wrapper.setAttribute('href', image.src);
  wrapper.setAttribute('aria-label', 'Click for Lightbox');
  image.parentNode.insertBefore(wrapper, image.parentNode.firstChild);
  wrapper.appendChild(image);
});

$(document).ready(function () {
  var $lightbox = $(".kg-gallery-card");
  $lightbox.refreshFsLightbox();
});


$(document).ready(function () {
	// Mobile Menu Trigger
	$('.gh-burger').click(function () {
		$('body').toggleClass('gh-head-open');
	});
});

require('fslightbox');

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
  var $lightbox = $(".kg-gallery-card img");
  $lightbox.refreshFsLightbox();
});

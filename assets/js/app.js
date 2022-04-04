$(document).ready(function () {
	// Mobile Menu Trigger
	$('.gh-burger').click(function () {
		$('body').toggleClass('gh-head-open');
	});
});

let CONFIG = {
  ENABLE_IMAGE_LIGHTBOX: !!`{{#if @custom.enable_image_lightbox}}{{@custom.enable_image_lightbox}}{{/if}}`,
  ENABLE_SCROLL_TO_TOP: true, /* Enable Scroll Top Button */
  OPEN_LINKS_IN_NEW_TAB: !!`{{#if @custom.open_external_links_in_new_tab}}{{@custom.open_external_links_in_new_tab}}{{/if}}`,
}

/**
* Handle Image Gallery
*/

require('fslightbox');

/**
* Handle Image Gallery
*/
const handleImageGallery = () => {
  const images = document.querySelectorAll('.kg-image-card img, .kg-gallery-card img');
  const galleryImages = document.querySelectorAll('.kg-gallery-image img');

  // Gallery style
  galleryImages.forEach(image => {
    image.setAttribute('alt', 'Gallery Image');
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = `${ratio} 1 0%`;
  })

  // Lighbox function

  images.forEach(image => {
    const link = image.parentNode.nodeName === 'A' ? image.parentNode.getAttribute('href') : '';
    var lightboxWrapper = link ? image.parentNode : document.createElement('a');

    lightboxWrapper.setAttribute('data-no-swup', '');
    lightboxWrapper.setAttribute('data-fslightbox', '');
    lightboxWrapper.setAttribute('href', image.src);
    lightboxWrapper.setAttribute('aria-label', 'Click for Lightbox');

    if (link) {
      var linkButton = document.createElement('a');
      linkButton.innerHTML = `<i class="icon icon-link icon--xs"><svg class="icon__svg"><use xlink:href="/assets/icons/feather-sprite.svg#link"></use></svg></i>`
      linkButton.setAttribute('class', 'image-link');
      linkButton.setAttribute('href', link);
      linkButton.setAttribute('target', '_blank');
      linkButton.setAttribute('rel', 'noreferrer noopener');
      lightboxWrapper.parentNode.insertBefore(linkButton, lightboxWrapper.parentNode.firstChild);
    } else {
      image.parentNode.insertBefore(lightboxWrapper, image.parentNode.firstChild);
      lightboxWrapper.appendChild(image);
    }
  });

  refreshFsLightbox();
}

/**
* DOM Loaded event
*/
const callback = () => {
  handleImageGallery();
};

if (
    document.readyState === 'complete' ||
    (document.readyState !== 'loading' && !document.documentElement.doScroll)
) {
  callback();
} else {
  document.addEventListener('DOMContentLoaded', callback);
}

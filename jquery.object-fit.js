// jquery.object-fit.js
// ====================
//
// Originally by Simon Schmid https://github.com/schmidsi
// Re-worked by Steve Workman https://github.com/steveworkman
// Polyfill for Object-fit property in CSS3 Images http://www.w3.org/TR/2012/CR-css3-images-20120417/#object-fit
//
// usage:
// ------
// ```
// $('.selector').objectFit(type);
// ```
//
// implemented types:
// 'contain' (default)
// 'cover'

(function($, window, document) {

	$.fn.objectFit = function(type) {

		// default type is "contain"
		var type = type || 'contain';

		return this.each(function() {

			// Find the first block level element, as we need the containing element, not just the next one up
			function findParentRatio(jqObject) {
				var p = jqObject.parent(),
					displayType = p.css('display');
				
				if (displayType == 'block' || displayType == '-webkit-box' && p.width() > 0) {
					return { obj: p, width: p.width(), height: p.height(), ratio: (p.width() / p.height()) };
				} else {
					return findParentRatio(p);
				}
			}

			var $this = $(this),
					ratio = $this.data('ratio'),
					parent = findParentRatio($this), // The parent element may not have any width or height, so find one that does
					pic_real_width,
					pic_real_height;

			$("<img/>") // Make in memory copy of image to avoid css issues
				.attr("src", $(this).attr("src"))
				.load(function() {
					pic_real_width = this.width;   // Note: $(this).width() will not
					pic_real_height = this.height; // work for in memory images.

					// set the ratio of the object. we assume, that the ratio of the object never changes.
					if (ratio === undefined) {
						ratio = pic_real_width / pic_real_height;
						$this.data('ratio', ratio);
					}

					// Set the width/height
					if (type === 'contain') {
						if (parent.ratio > ratio) {
							$this.width(parent.height * ratio);
						} else {
							$this.height(parent.width / ratio).width('100%');
						}
					}
					else if (type === 'cover') {
						// If the image is bigger in both dimensions than the parent, do nothing
						if (parent.width <= pic_real_width && parent.height <= pic_real_height) {
							// Do nothing
						} else {
							// At least one dimension is smaller, so cover needs to size the image
							if (parent.ratio > ratio) {
								$this.width(parent.width).height(parent.height * ratio);
							} else {
								$this.height(parent.height).width(parent.width * ratio);
							}
						}
						parent.obj.css('overflow', 'hidden');
					}
				});
		});
	};
})(jQuery, window, document);
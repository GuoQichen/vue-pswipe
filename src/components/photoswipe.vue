<template>
	<div>
		<div class="my-gallery" data-type="parent">
			<slot></slot>
		</div>

		<!-- Root element of PhotoSwipe. Must have class pswp. -->
		<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

			<!-- Background of PhotoSwipe.
				It's a separate element, as animating opacity is faster than rgba(). -->
			<div class="pswp__bg"></div>

			<!-- Slides wrapper with overflow:hidden. -->
			<div class="pswp__scroll-wrap">

				<!-- Container that holds slides. PhotoSwipe keeps only 3 slides in DOM to save memory. -->
				<!-- don't modify these 3 pswp__item elements, data is added later on. -->
				<div class="pswp__container">
					<div class="pswp__item"></div>
					<div class="pswp__item"></div>
					<div class="pswp__item"></div>
				</div>

				<!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
				<div class="pswp__ui pswp__ui--hidden">

					<div class="pswp__top-bar">

						<!--  Controls are self-explanatory. Order can be changed. -->

						<div class="pswp__counter"></div>

						<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

						<!-- Preloader demo https://codepen.io/dimsemenov/pen/yyBWoR -->
						<!-- element will get class pswp__preloader--active when preloader is running -->
						<div class="pswp__preloader">
							<div class="pswp__preloader__icn">
							<div class="pswp__preloader__cut">
								<div class="pswp__preloader__donut"></div>
							</div>
							</div>
						</div>
					</div>

					<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
						<div class="pswp__share-tooltip"></div>
					</div>

					<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
					</button>

					<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
					</button>

					<div class="pswp__caption">
						<div class="pswp__caption__center"></div>
					</div>

				</div>

				</div>

		</div>
	</div>
</template>

<script>
import isPlainObject from 'lodash/isPlainObject'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import PhotoSwipe from 'photoswipe/dist/photoswipe.min'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default.min'

/* eslint-disable */
export default {
	name: 'PhotoswipeOrigin',
	props: {
		options: Object
	},
	methods: {
		openPswp() {
			const _this = this
			var initPhotoSwipeFromDOM = function(gallerySelector) {

				// parse slide data (url, title, size ...) from DOM elements
				// (children of gallerySelector)
				var parseThumbnailElements = function(el) {
					var thumbElements = el.querySelectorAll('.image-wrapper'),
						numNodes = thumbElements.length,
						items = [],
						wrapperEl,
						size,
						item;

					for(var i = 0; i < numNodes; i++) {

						wrapperEl = thumbElements[i]; // image wrapper element

						// include only element nodes
						if(wrapperEl.nodeType !== 1) {
							continue;
						}

						size = wrapperEl.dataset.size.split('x');

						// create slide object
						item = {
							src: wrapperEl.dataset.src,
							w: parseInt(size[0], 10),
							h: parseInt(size[1], 10)
						};

						if(wrapperEl.children.length > 0) {
							// <img> thumbnail element, retrieving thumbnail url
							item.msrc = wrapperEl.dataset.src; 
						}

						item.el = wrapperEl; // save link to element for getThumbBoundsFn
						items.push(item);
					}

					return items;
				};

				// find nearest parent element
				var closest = function closest(el, fn) {
					return el && ( fn(el) ? el : closest(el.parentNode, fn) );
				};

				// triggers when user clicks on thumbnail
				var onThumbnailsClick = function(e) {
					e.preventDefault();

					var eTarget = e.target

					// find root element of slide
					var clickedListItem = closest(eTarget, function(el) {
						return el.classList.contains('image-wrapper')
					});

					if(!clickedListItem) {
						return;
					}

					// find index of clicked item by looping through all child nodes
					// alternatively, you may define index via data- attribute
					var clickedGallery = closest(clickedListItem.parentNode, function (el) {
						return el.dataset.type === 'parent'
					}),
						// childNodes = clickedGallery.querySelectorAll('figure'),
						childNodes = clickedGallery.querySelectorAll('.image-wrapper'),
						numChildNodes = childNodes.length,
						nodeIndex = 0,
						index;

					for (var i = 0; i < numChildNodes; i++) {
						if(childNodes[i].nodeType !== 1) {
							continue;
						}

						if(childNodes[i] === clickedListItem) {
							index = nodeIndex;
							break;
						}
						nodeIndex++;
					}



					if(index >= 0) {
						// open PhotoSwipe if valid index found
						openPhotoSwipe( index, clickedGallery );
					}
					return false;
				};

				// parse picture index and gallery index from URL (#&pid=1&gid=2)
				var photoswipeParseHash = function() {
					var hash = window.location.hash.substring(1),
					params = {};

					if(hash.length < 5) {
						return params;
					}

					var vars = hash.split('&');
					for (var i = 0; i < vars.length; i++) {
						if(!vars[i]) {
							continue;
						}
						var pair = vars[i].split('=');
						if(pair.length < 2) {
							continue;
						}
						params[pair[0]] = pair[1];
					}

					if(params.gid) {
						params.gid = parseInt(params.gid, 10);
					}

					return params;
				};

				var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
					var pswpElement = document.querySelectorAll('.pswp')[0],
						gallery,
						options,
						items;

					items = parseThumbnailElements(galleryElement);

					const isBgImg = items[0].el.querySelector('.image-item')
					// define options (if needed)
					options = {

						// dont need history in spa, prevent uncessary bug
						history: false,
						showHideOpacity: isBgImg,

						// define gallery index (for URL)
						galleryUID: galleryElement.getAttribute('data-pswp-uid'),

						getThumbBoundsFn: function(index) {
							// See Options -> getThumbBoundsFn section of documentation for more info
							var thumbnail = items[index].el.getElementsByTagName('img')[0] || items[index].el.getElementsByClassName('image-item')[0], // find thumbnail
								pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
								rect = thumbnail.getBoundingClientRect();

							return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
						},
					};

					// PhotoSwipe opened from URL
					if(fromURL) {
						if(options.galleryPIDs) {
							// parse real index when custom PIDs are used
							// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
							for(var j = 0; j < items.length; j++) {
								if(items[j].pid == index) {
									options.index = j;
									break;
								}
							}
						} else {
							// in URL indexes start from 1
							options.index = parseInt(index, 10) - 1;
						}
					} else {
						options.index = parseInt(index, 10);
					}

					// exit if index not found
					if( isNaN(options.index) ) {
						return;
					}

					if(disableAnimation) {
						options.showAnimationDuration = 0;
					}

					// add custom options
					if (isPlainObject(_this.options)) {
						Object.assign(options, _this.options)
					}

					// Pass data to PhotoSwipe and initialize it
					gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
					gallery.init();
				};

				// loop through all gallery elements and bind events
				var galleryElements = document.querySelectorAll( gallerySelector );

				for(var i = 0, l = galleryElements.length; i < l; i++) {
					galleryElements[i].setAttribute('data-pswp-uid', i+1);
					galleryElements[i].onclick = onThumbnailsClick;
				}

				// Parse URL and open gallery if it contains #&pid=3&gid=1
				var hashData = photoswipeParseHash();
				if(hashData.pid && hashData.gid) {
					openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
				}
			};

			// execute above function
			initPhotoSwipeFromDOM('.my-gallery');
		},
	},
	mounted() {
		this.openPswp()
	},
}
</script>
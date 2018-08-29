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
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import PhotoSwipe from 'photoswipe/dist/photoswipe.min'
import defaultUI from 'photoswipe/dist/photoswipe-ui-default.min'
import { setOptions, findIndex } from '../utils'

export default {
    name: 'PhotoswipeWrapper',
    props: {
        options: Object,
    },
    methods: {
        // find nearest parent element
        closest(el, fn) {
            return el && (fn(el) ? el : this.closest(el.parentNode, fn))
        },
        // parse slide data (url, title, size ...) from DOM elements
        parseThumbnailElements(el) {
            const thumbElements = [...el.querySelectorAll('.image-wrapper')]

            return thumbElements.map((wrapperEl) => {
                const { src } = wrapperEl.dataset
                const size = wrapperEl.dataset.size.split('x')
                return {
                    src,
                    msrc: src,
                    el: wrapperEl,
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10),
                }
            })
        },
        // triggers when user clicks on thumbnail
        onThumbnailsClick(e) {
            const eTarget = e.target

            // prevent uncessary click event be handle
            if (eTarget.tagName !== 'IMG' && !eTarget.classList.contains('image-item')) return

            // find root element of slide
            const clickedListItem = this.closest(eTarget, el => el.classList.contains('image-wrapper'))
            if (!clickedListItem) return

            // find index of clicked item by looping through all child nodes
            const clickedGallery = this.closest(clickedListItem.parentNode, el => el.dataset.type === 'parent')
            const childNodes = [...clickedGallery.querySelectorAll('.image-wrapper')]
            const index = findIndex(childNodes, child => child === clickedListItem)

            // open PhotoSwipe if valid index found
            if (index >= 0) this.openPhotoSwipe(index, clickedGallery)
        },
        // parse picture index and gallery index from URL (#&pid=1&gid=2)
        photoswipeParseHash() {
            const hash = window.location.hash.substring(1)
            const params = {}

            if (hash.length < 5) return params

            hash.split('&').reduce((acc, cur) => {
                if (!cur) return acc
                const pair = cur.split('=')
                if (pair.length < 2) return acc
                const [key, value] = pair
                acc[key] = value
                return acc
            }, params)

            if (params.gid) params.gid = parseInt(params.gid, 10)

            return params
        },
        getThumbBoundsFn: parsedThumbItems => (index) => {
            const thumbEl = parsedThumbItems[index].el
            // See Options -> getThumbBoundsFn section of documentation for more info
            const thumbnail = thumbEl.querySelector('img') || thumbEl.querySelector('.image-item')
            const pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            const rect = thumbnail.getBoundingClientRect()

            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
        },
        parseIndex(index, items, fromURL, options) {
            // PhotoSwipe opened from URL
            /* eslint-disable no-nested-ternary */
            return fromURL
                ? options.galleryPIDs
                    ? findIndex(items, item => item.pid === index)
                    : parseInt(index, 10) - 1
                : parseInt(index, 10)
        },
        openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
            const pswpElement = document.querySelectorAll('.pswp')[0]
            const items = this.parseThumbnailElements(galleryElement)
            const isBgImg = !!items[index].el.querySelector('.image-item')
            const options = {
                // dont need history in spa, prevent unnecessary bug
                history: false,
                showHideOpacity: isBgImg,
                // define gallery index (for URL)
                galleryUID: galleryElement.getAttribute('data-pswp-uid'),
                getThumbBoundsFn: this.getThumbBoundsFn(items),
            }

            const parsedIndex = this.parseIndex(index, items, fromURL, options)
            if (parsedIndex >= 0) options.index = parsedIndex

            // exit if index not found
            if (Number.isNaN(options.index)) return

            if (disableAnimation) options.showAnimationDuration = 0

            // add custom options
            setOptions(options, this.globalOptions)
            setOptions(options, this.options)

            // Pass data to PhotoSwipe and initialize it
            new PhotoSwipe(pswpElement, defaultUI, items, options).init()
        },
        initPhotoSwipeFromDOM(gallerySelector) {
            // loop through all gallery elements and bind events
            const galleryElements = [...document.querySelectorAll(gallerySelector)]

            galleryElements.forEach((gallery, index) => {
                gallery.setAttribute('data-pswp-uid', index + 1)
                /* eslint-disable no-param-reassign */
                gallery.onclick = this.onThumbnailsClick
            })

            // Parse URL and open gallery if it contains #&pid=3&gid=1
            const hashData = this.photoswipeParseHash()
            if (hashData.pid && hashData.gid) {
                this.openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true)
            }
        },
        openPswp() {
            this.initPhotoSwipeFromDOM('.my-gallery')
        },
    },
    mounted() {
        this.openPswp()
    },
}
</script>

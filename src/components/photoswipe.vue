<template>
	<div>
		<div class="my-gallery" data-type="parent" ref="gallery" @click="onThumbnailsClick">
			<slot></slot>
		</div>

		<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true" ref="pswp">
			<div class="pswp__bg"></div>
			<div class="pswp__scroll-wrap">
				<div class="pswp__container">
					<div class="pswp__item"></div>
					<div class="pswp__item"></div>
					<div class="pswp__item"></div>
				</div>

				<div class="pswp__ui pswp__ui--hidden">
					<div class="pswp__top-bar">
						<div class="pswp__counter"></div>
						<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
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
import { setOptions, findIndex, getImageSize, parseHash } from '../utils'

export default {
    name: 'PhotoswipeWrapper',
    props: {
        options: Object,
        auto: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        // find nearest parent element
        closest(el, fn) {
            return el && el.nodeType === 1 && (fn(el) ? el : this.closest(el.parentNode, fn))
        },
        // parse slide data (url, title, size ...) from DOM elements
        parseThumbnailElements(el) {
            let thumbElements = [...el.querySelectorAll('.image-wrapper')]
            if (this.auto && thumbElements.length === 0) {
                thumbElements = [...el.querySelectorAll('img')]
            }

            return thumbElements.map((wrapperEl) => {
                let { src } = wrapperEl.dataset
                const size = wrapperEl.dataset.size.split('x')

                if (this.auto && wrapperEl.tagName === 'IMG') {
                    src = wrapperEl.src // eslint-disable-line
                    wrapperEl.dataset.src = src // eslint-disable-line
                }
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
            const clickedListItem = this.closest(eTarget, el =>
                el.classList.contains('image-wrapper') ||
                (this.auto && el.tagName === 'IMG'),
            )
            if (!clickedListItem) return

            // find index of clicked item by looping through all child nodes
            const clickedGallery = this.closest(clickedListItem.parentNode, el => el.dataset.type === 'parent')
            let childNodes = [...clickedGallery.querySelectorAll('.image-wrapper')]
            if (this.auto && childNodes.length === 0) {
                childNodes = [...clickedGallery.querySelectorAll('img')]
            }
            const index = findIndex(childNodes, child => child === clickedListItem)
            // open PhotoSwipe if valid index found
            if (index >= 0) this.openPhotoSwipe(index, clickedGallery)
        },


        getThumbBoundsFn(parsedThumbItems) {
            return (index) => {
                const thumbEl = parsedThumbItems[index].el
                // See Options -> getThumbBoundsFn section of documentation for more info
                let thumbnail = thumbEl.querySelector('img') || thumbEl.querySelector('.image-item')
                if (this.auto && thumbEl.tagName === 'IMG') {
                    thumbnail = thumbEl
                }
                const pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                const rect = thumbnail.getBoundingClientRect()

                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
            }
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
            // TODO: determin public or private
            // const pswpElement = document.querySelectorAll('.pswp')[0]
            const pswpElement = this.$refs.pswp
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
            const galleryElements = [...document.querySelectorAll(gallerySelector)]
            const { gallery } = this.$refs
            const galleryIndex = findIndex(galleryElements, el => el === gallery)
            const currentGid = galleryIndex + 1
            gallery.setAttribute('data-pswp-uid', currentGid)

            // Parse URL and open gallery if it contains #&pid=3&gid=1
            const { pid, gid } = parseHash()
            if (pid && gid && gid === currentGid) {
                // in history mode, it will be empty in first time access because cant get image size
                setTimeout(() => {
                    this.openPhotoSwipe(pid - 1, gallery, true, true)
                })
            }
        },
        openPswp() {
            this.initPhotoSwipeFromDOM('.my-gallery')
        },
        setImageSize() {
            const { gallery } = this.$refs
            const imgs = gallery.querySelectorAll('img')
            const defaultSize = { w: 0, h: 0 }
            // eslint-disable-next-line
            const setDataset = (el, { w, h }) => { el.dataset.size = `${w}x${h}` }
            imgs.forEach((img) => {
                getImageSize(img.src)
                    .then(size => setDataset(img, size))
                    .catch(() => setDataset(img, defaultSize))
            })
        },
    },
    mounted() {
        this.auto && this.setImageSize() // eslint-disable-line
        this.openPswp()
    },
}
</script>

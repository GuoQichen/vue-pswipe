<template>
    <div
        class="pswipe-gallery"
        ref="gallery"
        @click="onThumbnailsClick"
    >
        <slot></slot>
    </div>
</template>

<script>
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import PhotoSwipe from 'photoswipe/dist/photoswipe.min'
import defaultUI from 'photoswipe/dist/photoswipe-ui-default.min'

import { defualtGlobalOption } from '../config'

import {
    findIndex,
    getImageSize,
    parseHash,
    closest,
    querySelectorList,
    get,
    errorHandler,
    isImg,
} from '../utils'

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
        getThumbnailElements() {
            // TODO: will be invoke twice in one click event (parse and open)
            // TODO: will be invoke in click every time (think carefully, include dynamic html generate)
            let thumbnailElements = querySelectorList('.image-wrapper', this.gallery)
            if (this.auto && thumbnailElements.length === 0) {
                thumbnailElements = querySelectorList('img', this.gallery)
            }
            return thumbnailElements
        },
        parseThumbnailElements() {
            return this.getThumbnailElements().map((wrapperEl) => {
                const src = get(wrapperEl, 'dataset.src', this.auto ? wrapperEl.src : '')
                const size = get(wrapperEl, 'dataset.size', '').split('x')

                if (!size[0]) return errorHandler('cant find data-size in thumbnail element')

                return {
                    src,
                    msrc: src,
                    el: wrapperEl,
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10),
                }
            })
        },
        // prevent uncessary click event be handle
        irrelevant(eventTarget) {
            return !isImg(eventTarget) && !eventTarget.classList.contains('image-item')
        },
        // find root element of slide
        getClickedListItem(eventTarget) {
            return closest(eventTarget, el =>
                el.classList.contains('image-wrapper') ||
                (this.auto && el.tagName === 'IMG'),
            )
        },
        // triggers when user clicks on thumbnail
        onThumbnailsClick(e) {
            const eTarget = e.target
            if (this.irrelevant(eTarget)) return

            const clickedListItem = this.getClickedListItem(eTarget)
            if (!clickedListItem) return

            // find index of clicked item by looping through all child nodes
            const childNodes = this.getThumbnailElements()
            const index = findIndex(childNodes, child => child === clickedListItem)

            // open PhotoSwipe if valid index found
            if (index >= 0) this.openPhotoSwipe(index, this.gallery)
        },
        // TODO: use .pswipe-item instead of component
        getPresentElement(thumbEl) {
            let thumbnail = thumbEl.querySelector('img') || thumbEl.querySelector('.image-item')
            if (this.auto && thumbEl.tagName === 'IMG') {
                thumbnail = thumbEl
            }
            return thumbnail
        },
        getThumbBoundsFn(parsedThumbItems) {
            return (index) => {
                const thumbEl = parsedThumbItems[index].el
                const thumbnail = this.getPresentElement(thumbEl)
                const pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                const rect = thumbnail.getBoundingClientRect()

                return {
                    x: rect.left,
                    y: rect.top + pageYScroll,
                    w: rect.width,
                }
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
        isBgImg(el) {
            return !!el.querySelector('.image-item')
        },
        openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
            const items = this.parseThumbnailElements(galleryElement)
            const options = {
                showHideOpacity: this.isBgImg(items[index].el),
                // define gallery index (for URL)
                galleryUID: galleryElement.getAttribute('data-pswp-uid'),
                getThumbBoundsFn: this.getThumbBoundsFn(items),
            }

            const parsedIndex = this.parseIndex(index, items, fromURL, options)
            if (parsedIndex >= 0) options.index = parsedIndex

            if (Number.isNaN(options.index)) return

            if (disableAnimation) options.showAnimationDuration = 0

            Object.assign(options, defualtGlobalOption, this.globalOptions, this.options)

            new PhotoSwipe(this.pswpElement, defaultUI, items, options).init()
        },
        initPhotoSwipeFromDOM(gallerySelector) {
            const galleryElements = querySelectorList(gallerySelector)
            const galleryIndex = findIndex(galleryElements, el => el === this.gallery)
            const currentGid = galleryIndex + 1
            this.gallery.setAttribute('data-pswp-uid', currentGid)

            // Parse URL and open gallery if it contains #&pid=3&gid=1
            const { pid, gid } = parseHash()
            if (pid && gid && gid === currentGid) {
                // in history mode, it will be empty in first time access because cant get image size
                setTimeout(() => {
                    this.openPhotoSwipe(pid - 1, this.gallery, true, true)
                })
            }
        },
        openPswp() {
            this.initPhotoSwipeFromDOM('.pswipe-gallery')
        },
        setImageSize() {
            const { gallery } = this.$refs
            const imgs = gallery.querySelectorAll('img')
            const defaultSize = { w: 0, h: 0 }
            // eslint-disable-next-line
            const setDataset = (el, { w, h }) => { el.dataset.size = `${w}x${h}` }
            imgs.forEach((img) => {
                if (img.dataset.size) return
                getImageSize(img.src)
                    .then(size => setDataset(img, size))
                    .catch(() => setDataset(img, defaultSize))
            })
        },
    },
    mounted() {
        this.gallery = this.$refs.gallery
        this.auto && this.setImageSize() // eslint-disable-line
        this.openPswp()
    },
}
</script>

<template>
    <div
        class="pswipe-gallery"
        ref="gallery"
        @click="onThumbClick"
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
    querySelectorList,
    get,
    errorHandler,
    setSize,
    getSrc,
    relevant,
    isBgImg,
} from '../utils'

export default {
    name: 'Photoswipe',
    props: {
        options: Object,
        auto: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        getThumbEls() {
            return this.auto
                ? querySelectorList('img', this.gallery)
                : querySelectorList('[data-pswp-src]', this.gallery)
        },
        parseThumbEls(thumbEls = this.getThumbEls()) {
            return thumbEls.map((wrapperEl) => {
                const src = getSrc(wrapperEl, this.auto)
                const size = get(wrapperEl, 'dataset.pswpSize', '').split('x')
                if (!size[0]) return errorHandler('cant find data-pswp-size in thumbnail element')

                return {
                    src,
                    msrc: src,
                    el: wrapperEl,
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10),
                }
            })
        },
        onThumbClick(e) {
            const eTarget = e.target
            if (!relevant(eTarget, this.auto)) return

            const thumbEls = this.getThumbEls()
            const index = findIndex(
                thumbEls,
                child => child === eTarget,
            )
            if (index === -1) return

            this.openPhotoSwipe({ index, thumbEls })
        },
        getThumbBoundsFn(parsedItems) {
            return (index) => {
                const thumbEl = parsedItems[index].el
                const pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                const rect = thumbEl.getBoundingClientRect()

                return {
                    x: rect.left,
                    y: rect.top + pageYScroll,
                    w: rect.width,
                }
            }
        },
        parseIndex(index, items, fromURL, options) {
            return fromURL
                ? options.galleryPIDs
                    ? findIndex(items, item => item.pid === index)
                    : parseInt(index, 10) - 1
                : parseInt(index, 10)
        },
        openPhotoSwipe({
            index,
            disableAnimation,
            fromURL,
            thumbEls,
        }) {
            const items = this.parseThumbEls(thumbEls)
            const options = {
                showHideOpacity: isBgImg(items[index].el),
                galleryUID: this.gallery.dataset.pswpUid, // define gallery index (for URL)
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
            const galleryEls = querySelectorList(gallerySelector)
            const galleryIndex = findIndex(galleryEls, el => el === this.gallery)
            const currentGid = galleryIndex + 1
            this.gallery.dataset.pswpUid = currentGid

            // Parse URL and open gallery if it contains #&pid=3&gid=1
            const { pid, gid } = parseHash()
            if (pid && gid && gid === currentGid) {
                // in history mode, it will be empty in first time access because cant get image size
                setTimeout(() => {
                    this.openPhotoSwipe({
                        index: pid - 1,
                        disableAnimation: true,
                        fromURL: true,
                    })
                })
            }
        },
        openPswp() {
            this.initPhotoSwipeFromDOM('.pswipe-gallery')
        },
        setImageSize() {
            this.getThumbEls()
                .forEach((target) => {
                    if (target.dataset.pswpSize) return
                    getImageSize(getSrc(target, this.auto))
                        .then(size => setSize(target, size))
                        .catch(() => setSize(target))
                })
        },
    },
    mounted() {
        this.gallery = this.$refs.gallery
        this.setImageSize() // eslint-disable-line
        this.openPswp()
    },
}
</script>

<template>
    <div
        class="pswipe-gallery"
        ref="gallery"
        @click="onThumbClick"
    >
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import PhotoSwipe, { Item } from 'photoswipe'
import defaultUI from 'photoswipe/dist/photoswipe-ui-default'

import { defualtGlobalOption } from '@/config'
import { Filter, Options } from '@/type/index.d'

import {
    findIndex,
    getImageSize,
    parseHash,
    querySelectorList,
    get,
    setSize,
    getSrc,
    relevant,
    isBgImg,
    isNum,
    closest,
} from '../utils'

interface ParsedItem extends Item {
    el: HTMLElement
    src: string
    msrc?: string
    pid?: number
}

interface ThumbBounds {
    x: number
    y: number
    w: number
}

interface OpenArgs {
    index: number
    disableAnimation?: boolean
    fromURL?: boolean
    thumbEls?: HTMLElement[]
}

interface BeforeOpenEvent {
    index: number
    target: HTMLElement
}

type BeforeOpenNext = (continued?: boolean) => void

@Component
export default class Photoswipe extends Vue {
    gallery!: HTMLElement
    pswpElement!: HTMLElement
    globalOptions!: Options

    $refs!: {
        gallery: HTMLElement
    }

    @Prop(Object) options!: Options
    @Prop({ type: Boolean, default: false }) auto!: boolean
    @Prop({ type: Boolean, default: false }) bubble!: boolean
    @Prop({ type: Function, default: () => true }) filter!: Filter

    getThumbEls(): HTMLElement[] {
        return this.auto
            ? querySelectorList<HTMLImageElement>('img', this.gallery).filter(this.filter)
            : querySelectorList('[data-pswp-src]', this.gallery)
    }

    parseThumbEls(thumbEls = this.getThumbEls()): ParsedItem[] {
        return thumbEls.map((wrapperEl) => {
            const src = getSrc(wrapperEl, this.auto) || ''
            const size = get(wrapperEl, 'dataset.pswpSize', '').split('x')

            return {
                src,
                msrc: src,
                el: wrapperEl,
                w: Number(size[0] || 0),
                h: Number(size[1] || 0),
            }
        })
    }

    onThumbClick(e: { target: HTMLElement }, skipHook?: boolean) {
        const eTarget = (
            !this.auto
            && this.bubble
            && closest(e.target, el => !!el.dataset.pswpSrc)
        ) || e.target

        if (!relevant(eTarget, this.auto, this.filter)) return

        const size = eTarget.dataset.pswpSize
        const thumbEls = this.getThumbEls()

        if (!size) {
            this.setImageSize(thumbEls)
                .then(() => {
                    this.onThumbClick({ target: eTarget })
                })
            return
        }

        const index = findIndex(
            thumbEls,
            child => child === eTarget,
        )
        if (index === -1) return

        if (this.$listeners.beforeOpen && !skipHook) {
            const beforeOpenEvent: BeforeOpenEvent = { index, target: eTarget }
            const beforeOpenNext: BeforeOpenNext = (continued: boolean = true) => {
                if (!continued) return
                this.onThumbClick({ target: eTarget }, true)
            }
            this.$emit('beforeOpen', beforeOpenEvent, beforeOpenNext)
            return
        }

        this.openPhotoSwipe({ index, thumbEls })
    }

    getThumbBoundsFn(parsedItems: ParsedItem[]) {
        return (index: number): ThumbBounds => {
            const thumbEl = parsedItems[index].el
            const pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            const rect = thumbEl.getBoundingClientRect()

            return {
                x: rect.left,
                y: rect.top + pageYScroll,
                w: rect.width,
            }
        }
    }

    parseIndex(index: number, items: ParsedItem[], options: Options, fromURL?: boolean) {
        return fromURL
            ? options.galleryPIDs
                ? findIndex(
                    items,
                    item => item.pid === index,
                )
                : index - 1
            : index
    }

    openPhotoSwipe({
        index,
        disableAnimation,
        fromURL,
        thumbEls,
    }: OpenArgs) {
        const items = this.parseThumbEls(thumbEls)
        const options: Options = {
            showHideOpacity: isBgImg(items[index].el),
            galleryUID: +(this.gallery.dataset.pswpUid || ''), // define gallery index (for URL)
            getThumbBoundsFn: this.getThumbBoundsFn(items),
        }

        const parsedIndex = this.parseIndex(index, items, options, fromURL)
        if (parsedIndex >= 0) options.index = parsedIndex
        if (!isNum(options.index) || Number.isNaN(options.index)) return

        if (disableAnimation) options.showAnimationDuration = 0

        Object.assign(options, defualtGlobalOption, this.globalOptions, this.options)

        new PhotoSwipe(this.pswpElement, defaultUI, items, options).init()
    }
    initPhotoSwipeFromDOM(gallerySelector: string) {
        const galleryEls = querySelectorList(gallerySelector)
        const galleryIndex = findIndex(galleryEls, el => el === this.gallery)
        const currentGid = galleryIndex + 1
        this.gallery.dataset.pswpUid = `${currentGid}`

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
    }
    openPswp() {
        this.initPhotoSwipeFromDOM('.pswipe-gallery')
    }
    setImageSizeSeparately(thumbEl: HTMLElement) {
        return getImageSize(getSrc(thumbEl, this.auto))
            .then(size => setSize(thumbEl, size))
    }
    setImageSize(thumbEls = this.getThumbEls()) {
        return Promise.all(
            thumbEls
                .filter(thumbEl => !thumbEl.dataset.pswpSize)
                .map(thumbEl => this.setImageSizeSeparately(thumbEl)),
        )
    }

    mounted() {
        this.gallery = this.$refs.gallery
        this.setImageSize() // eslint-disable-line
        this.openPswp()
    }
}
</script>
<style>
@import '~photoswipe/dist/photoswipe.css';
@import '~photoswipe/dist/default-skin/default-skin.css';
</style>

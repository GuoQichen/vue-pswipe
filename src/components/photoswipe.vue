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
import PhotoSwipe from 'photoswipe'
import defaultUI from 'photoswipe/dist/photoswipe-ui-default'
import { defualtGlobalOption } from '@/config'
import {
    PswpOptions,
    PswpItem,
    BeforeOpen,
    BeforeOpenEvent,
    Filter,
    OpenPhotoSwipeArgs,
} from '@/type'
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
    setSizeToTarget,
} from '../utils'

@Component
export default class Photoswipe extends Vue {
    gallery!: HTMLElement
    pswpElement!: HTMLElement
    globalOptions!: PswpOptions
    pswp!: PhotoSwipe<PswpOptions>

    $refs!: {
        gallery: HTMLElement
    }

    @Prop(Object) options!: PswpOptions
    @Prop({ type: Boolean, default: false }) auto!: boolean
    @Prop({ type: Boolean, default: false }) bubble!: boolean
    @Prop({ type: Function, default: () => true }) filter!: Filter

    getThumbEls(): HTMLElement[] {
        return this.auto
            ? querySelectorList<HTMLImageElement>('img', this.gallery).filter(this.filter)
            : querySelectorList('[data-pswp-src]', this.gallery)
    }

    parseThumbEls(thumbEls = this.getThumbEls()): PswpItem[] {
        return thumbEls.map((el) => {
            const src = getSrc(el, this.auto) || ''
            const size = get(el, 'dataset.pswpSize', '').split('x')
            const title = get(el, 'dataset.pswpTitle', '')
            const msrc = get(el, 'dataset.pswpMsrc', '')

            return Object.assign({
                src,
                el,
                w: Number(size[0] || 0),
                h: Number(size[1] || 0),
                title,
            }, msrc && { msrc })
        })
    }

    onThumbClick(e: { target: HTMLElement }, skipHook?: boolean) {
        const eTarget = (
            !this.auto
            && this.bubble
            && closest(e.target, el => !!el.dataset.pswpSrc)
        ) || e.target

        if (!relevant(eTarget, this.auto, this.filter)) return

        const thumbEls = this.getThumbEls()
        const index = findIndex(thumbEls, el => el === eTarget)
        if (index === -1) return

        if (this.$listeners.beforeOpen && !skipHook) {
            const beforeOpenEvent: BeforeOpenEvent = { index, target: eTarget }
            const beforeOpen: BeforeOpen = (continued: boolean = true) => {
                if (!continued) return
                this.onThumbClick({ target: eTarget }, true)
            }
            this.$emit('beforeOpen', beforeOpenEvent, beforeOpen)
            return
        }

        this.openPhotoSwipe({ index, thumbEls })
    }

    getThumbBoundsFn(parsedItems: PswpItem[]) {
        return (index: number): { x: number, y: number, w: number } => {
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

    parseIndex(index: number, items: PswpItem[], options: PswpOptions, fromURL?: boolean) {
        return fromURL
            ? options.galleryPIDs
                ? findIndex(items, item => item.pid === index)
                : index - 1
            : index
    }

    openPhotoSwipe({
        index,
        fromURL,
        thumbEls,
    }: OpenPhotoSwipeArgs) {
        const items = this.parseThumbEls(thumbEls)

        const targetItem = items[index]
        const { w, h, msrc } = targetItem
        if (!w && !h && msrc) setSizeToTarget(targetItem, 'msrc')

        const options: PswpOptions = {
            showHideOpacity: isBgImg(items[index].el),
            galleryUID: +(this.gallery.dataset.pswpUid || ''), // define gallery index (for URL)
            getThumbBoundsFn: this.getThumbBoundsFn(items),
        }

        const parsedIndex = this.parseIndex(index, items, options, fromURL)
        if (parsedIndex >= 0) options.index = parsedIndex
        if (!isNum(options.index) || Number.isNaN(options.index)) return
        if (fromURL) options.showAnimationDuration = 0

        Object.assign(options, defualtGlobalOption, this.globalOptions, this.options)

        const pswp = new PhotoSwipe(this.pswpElement, defaultUI, items, options)
        pswp.init()

        this.pswp = pswp
        this.bindEvent()
    }

    bindEvent() {
        this.pswp.listen('close', () => this.$emit('beforeClose'))
        this.pswp.listen('destroy', () => this.$emit('closed'))
        this.pswp.listen('imageLoadComplete', (index, item: PswpItem) => {
            if (item.el.dataset.pswpSize) return
            setSizeToTarget(item, 'src')
            if (this.pswp.getCurrentIndex() === index) this.pswp.invalidateCurrItems()
            this.pswp.updateSize(true)
        })
        this.pswp.listen('gettingData', (index, item: PswpItem) => {
            const { w, h, msrc } = item
            if (!msrc || w || h) return
            setSizeToTarget(item, 'msrc')
        })
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
        this.openPswp()
    }
}
</script>
<style>
@import '~photoswipe/dist/photoswipe.css';
@import '~photoswipe/dist/default-skin/default-skin.css';
</style>

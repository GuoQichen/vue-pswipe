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
import { GlobalOption } from '@/config'
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
    setSize,
    getSrc,
    relevant,
    isBgImg,
    isNum,
    closest,
    createPhotoSwipe,
    UI,
    Event,
    errorHandler,
} from '@/utils'

@Component({
    name: 'Photoswipe',
})
export default class Photoswipe extends Vue {
    gallery!: HTMLElement
    pswp!: PhotoSwipe<PswpOptions>

    $refs!: {
        gallery: HTMLElement
    }

    @Prop(Object) options!: PswpOptions
    @Prop({ type: Boolean, default: false }) auto!: boolean
    @Prop({ type: Boolean, default: false }) bubble!: boolean
    @Prop({ type: Boolean, default: true }) lazy!: boolean
    @Prop({ type: Function, default: () => true }) filter!: Filter
    @Prop({ type: Boolean, default: false }) rotate!: boolean

    getThumbEls(): HTMLElement[] {
        return this.auto
            ? querySelectorList<HTMLImageElement>('img', this.gallery).filter(this.filter)
            : querySelectorList('[data-pswp-src]', this.gallery)
    }

    parseThumbEls(thumbEls = this.getThumbEls()): PswpItem[] {
        return thumbEls.map((el) => {
            const data = el.dataset
            const src = getSrc(el, this.auto) || ''
            const msrc = data.pswpMsrc || src
            const size = (data.pswpSize || '').split('x')

            const item = {
                msrc,
                src,
                el,
                w: Number(size[0] || 0),
                h: Number(size[1] || 0),
            } as PswpItem

            const title = data.pswpTitle
            const pid = data.pswpPid

            if (title) item.title = title
            if (pid) item.pid = pid

            return item
        })
    }

    onThumbClick(e: { target: HTMLElement }) {
        const eTarget = (
            !this.auto
            && this.bubble
            && closest(e.target, el => !!el.dataset.pswpSrc)
        ) || e.target

        if (!relevant(eTarget, this.auto, this.filter)) return

        const thumbEls = this.getThumbEls()
        const index = findIndex(thumbEls, el => el === eTarget)
        if (index === -1) return

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

    parseIndex(index: number | string, items: PswpItem[], options: PswpOptions, fromURL?: boolean): number {
        return fromURL
            ? options.galleryPIDs
                ? findIndex(items, item => item.pid === index)
                // in URL indexes start from 1
                : +index - 1
            : +index
    }

    openPhotoSwipe({
        index,
        fromURL,
        thumbEls,
    }: OpenPhotoSwipeArgs) {
        const items = this.parseThumbEls(thumbEls)

        const options: PswpOptions = {
            galleryUID: +(this.gallery.dataset.pswpUid || ''), // define gallery index (for URL)
            getThumbBoundsFn: this.getThumbBoundsFn(items),
            ...GlobalOption.get(),
            ...this.options,
        }

        const parsedIndex = this.parseIndex(index, items, options, fromURL)

        if (parsedIndex >= 0) options.index = parsedIndex
        if (!isNum(options.index) || Number.isNaN(options.index)) return errorHandler('PhotoSwipe cannot be opened because the index is invalid. If you use a custom pid, set options.galleryPIDs to true.')
        if (fromURL) options.showAnimationDuration = 0
        if (!options.showHideOpacity) options.showHideOpacity = isBgImg(items[parsedIndex].el)

        const open = () => {
            this.pswp = createPhotoSwipe({
                items,
                options,
                context: this,
            })
            this.$emit('opened', this.pswp)
            Event.emit('opened', this.$props)
        }

        if (this.$listeners.beforeOpen) {
            const beforeOpenEvent: BeforeOpenEvent = {
                index: parsedIndex,
                items,
                options,
                target: items[parsedIndex].el,
            }
            const beforeOpen: BeforeOpen = (continued: boolean = true) => {
                if (!continued) return
                open()
            }
            this.$emit('beforeOpen', beforeOpenEvent, beforeOpen)
            return
        }
        open()
    }

    initPhotoSwipeFromDOM(gallerySelector: string) {
        const galleryEls = querySelectorList(gallerySelector)
        const galleryIndex = findIndex(galleryEls, el => el === this.gallery)
        const currentGid = galleryIndex + 1
        this.gallery.dataset.pswpUid = `${currentGid}`

        // Parse URL and open gallery if it contains #&pid=3&gid=1
        const { pid, gid } = parseHash()
        if (pid && gid && +gid === currentGid) {
            // in history mode, it will be empty in first time access because cant get image size
            setTimeout(() => {
                this.openPhotoSwipe({
                    index: pid,
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

    created() {
        UI.append()
    }

    mounted() {
        this.gallery = this.$refs.gallery
        if (!this.lazy) this.setImageSize()
        this.openPswp()
    }
}
</script>
<style>
@import '~photoswipe/dist/photoswipe.css';
@import '~photoswipe/dist/default-skin/default-skin.css';

.pswipe-gallery [data-pswp-src] {
    cursor: pointer; /* Fallback for unsupported browsers */
    cursor: zoom-in;
}
</style>

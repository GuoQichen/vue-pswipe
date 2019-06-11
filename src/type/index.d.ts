import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
import { Item } from 'photoswipe'

export interface Options extends PhotoSwipeUI_Default.Options {
    galleryPIDs?: number
}

export type Filter = (img: HTMLImageElement) => boolean

export interface PswpItemOptions {
    src: string // path to image
    size?: string // image size, 'width x height', eg: '100x100'
    msrc?: string // small image placeholder,
    // main (large) image loads on top of it,
    // if you skip this parameter - grey rectangle will be displayed,
    // try to define this property only when small image was loaded before
    title?: string // used by Default PhotoSwipe UI
    // if you skip it, there won't be any caption
}

export interface ParsedItem extends Item {
    el: HTMLElement
    src: string
    msrc?: string
    pid?: number
}

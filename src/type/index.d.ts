import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'

export interface Options extends PhotoSwipeUI_Default.Options {
    galleryPIDs?: number
}

export type Filter = (img: HTMLImageElement) => boolean

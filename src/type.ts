import Vue from 'vue'
import { Options, Item } from 'photoswipe/dist/photoswipe-ui-default'

/**
 * v-pswp directive config options
 */
export interface PswpDirectiveOptions {
    /**
     * path to image
     */
    src: string
    /**
     * image size, 'width x height', eg: '100x100'
     */
    size?: string
    /**
     * small image placeholder,
     * main (large) image loads on top of it,
     * if you skip this parameter - grey rectangle will be displayed,
     * try to define this property only when small image was loaded before
     */
    msrc?: string
    /**
     * used by Default PhotoSwipe UI
     * if you skip it, there won't be any caption
     */
    title?: string
    /**
     * to make URLs to a single image look like this: http://example.com/#&gid=1&pid=custom-first-id
     * instead of: http://example.com/#&gid=1&pid=1
     * enable options history:true, galleryPIDs:true and add pid (unique picture identifier)
     */
    pid?: string | number
}

export interface PswpItem extends Item {
    el: HTMLElement
    src: string
    msrc?: string
    pid?: number | string
    verticalRotated?: boolean
}

export interface CurrentPswpItem extends PswpItem {
    container: HTMLElement
    loaded: boolean
}

export interface PswpOptions extends Options {
    galleryPIDs?: number
}

export interface OpenPhotoSwipeArgs {
    index: number | string
    fromURL?: boolean
    thumbEls?: HTMLElement[]
}

export interface BeforeOpenEvent {
    index: number
    target: HTMLElement
    items: PswpItem[]
    options: PswpOptions
}

export interface Size {
    w: number
    h: number
}

interface CreatePhotoSwipeArgs {
    items: PswpItem[]
    options: PswpOptions
    context: Vue
}

export interface PswpProps {
    options: PswpOptions
    auto: boolean
    bubble: boolean
    lazy: boolean
    filter: Function
    rotate: boolean
}

// types
export type Fn = (...args: any[]) => void

export type Pswp = PhotoSwipe<PswpOptions>

export type BeforeOpen = (continued?: boolean) => void

export type Filter = (img: HTMLImageElement) => boolean

export type FindIndex = <T>(
    array: T[],
    predicate: (item: T, idx: number) => boolean
) => number

export type Closest = (
    el: Node | null,
    predicate: (el: HTMLElement) => boolean
) => HTMLElement | false

export type Get = <T>(
    context: Record<string, any>,
    path: string,
    defaultValue: T
) => T

export type Single = <T>(fn: Function) => (...args: any[]) => T

export type BindEvent = (context: Vue, pswp: Pswp) => void

export type CreatePhotoSwipe = (arg: CreatePhotoSwipeArgs) => Pswp

export type HandleWithoutSize = (pswp: Pswp) => void

export type GetContainSize = (
    areaWidth: number,
    areaHeight: number,
    width: number,
    height: number
) => Size

export type RotateDirection = 'left' | 'right'

export type StyleKey = Exclude<keyof CSSStyleDeclaration, number | 'length' | 'parentRule'>

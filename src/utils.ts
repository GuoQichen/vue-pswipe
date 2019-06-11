import PhotoSwipe from 'photoswipe'
import { PswpItemOptions, ParsedItem, Options } from './type/index.d'

export const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export const isNum = (value: any): value is number => typeof value === 'number'

export const isStr = (value: any): value is string => typeof value === 'string'

export const isObj = (value: any): value is object => Object.prototype.toString.call(value) === '[object Object]'

const isDef = (value: any) => (value !== undefined) && (value !== null)

export const isImg = (el: HTMLElement): el is HTMLImageElement => el.tagName === 'IMG'

const isEle = (node: Node): node is HTMLElement => node.nodeType === 1

export const isBgImg = (el: HTMLElement) => !isImg(el) && !!el.dataset.pswpSrc

export const errorHandler = (hint: string) => {
    throw new Error(
        `[vue-pswipe] ${hint}`,
    )
}

interface Size {
    w: number
    h: number
}

interface ParsedImg extends Size {
    src: string
}

export const getImageSize = (path: string) => new Promise<ParsedImg>((resolve) => {
    const img = new Image()
    let timer: number
    img.src = path
    img.addEventListener('error', () => {
        clearTimeout(timer)
    })
    const check = () => {
        if (img.width > 0 || img.height > 0) {
            return resolve({
                src: path,
                w: img.width,
                h: img.height,
            })
        }
        timer = window.setTimeout(check, 40)
    }
    check()
})

type FindIndex = <T>(array: T[], fn: (item: T, idx: number) => boolean) => number

export const findIndex: FindIndex = (array, fn) => {
    let index = -1
    array.some((item, idx) => {
        const result = fn(item, idx)
        if (result) index = idx
        return result
    })
    return index
}

/**
 * parse picture index and gallery index from URL (#&pid=1&gid=2)
 */
export const parseHash = () => {
    const hash = window.location.hash.substring(1)
    const params: Record<string, number> = {}

    if (hash.length < 5) return params

    hash.split('&').reduce((acc, cur) => {
        if (!cur) return acc
        const pair = cur.split('=')
        if (pair.length < 2) return acc
        const [key, value] = pair
        acc[key] = +value
        return acc
    }, params)

    return params
}

export const querySelectorList = <T extends HTMLElement>(
    selector: string,
    context: HTMLElement | Document = document,
) => [...context.querySelectorAll(selector)] as T[]

type Closest = (el: Node | null, fn: (el: HTMLElement) => boolean) => HTMLElement | false

/**
 * find nearest parent element
 */
export const closest: Closest = (el, fn) =>
    !!el &&
    isEle(el) &&
    (fn(el) ? el : closest(el.parentNode, fn))

type Get = <T>(context: Record<string, any>, path: string, defaultValue: T) => T

export const get: Get = (context, path, defaultValue) => {
    try {
        const result = path.split('.').reduce<any>((acc, cur) => acc[cur], context)
        return isDef(result)
            ? result
            : defaultValue
    } catch (err) {
        return defaultValue
    }
}

type Single = <T>(fn: Function) => (...args: any[]) => T

export const single: Single = (fn) => {
    let result: any
    return function (this: any, ...args: any[]) { // eslint-disable-line
        return result || (result = fn.apply(this, args)) // eslint-disable-line
    }
}

const append = (el: HTMLElement) => document.body.appendChild(el)

export const appendOnce = single<HTMLElement>(append)

export const setSize = (el: HTMLElement, { w, h }: Size) => el.dataset.pswpSize = `${w}x${h}` // eslint-disable-line

export const getSrc = (target: HTMLImageElement | HTMLElement, auto: boolean): string => (
    auto && isImg(target)
        ? target.src
        : target.dataset.pswpSrc || ''
)

// prevent uncessary click event be handle
export const relevant = (
    el: HTMLElement,
    auto: boolean,
    filter: (el: HTMLImageElement) => boolean,
): boolean => (
    auto
        ? isImg(el) && filter(el)
        : !!el.dataset.pswpSrc
)

const upperFirst = (str: string) => str.replace(/^\S/, match => match.toUpperCase())

const getPswpDataKey = (property: string) => `pswp${upperFirst(property)}`

type OptionKeys = keyof PswpItemOptions

export const setPswpData = (options: PswpItemOptions, el: HTMLElement) => {
    (Object.keys(options) as OptionKeys[]).forEach((key: OptionKeys) => {
        el.dataset[getPswpDataKey(key)] = options[key] // eslint-disable-line
    })
}

export const setPswpDataByCond = (el: HTMLElement, value: string | PswpItemOptions) => {
    if (isStr(value)) setPswpData({ src: value }, el)
    if (isObj(value)) setPswpData((value as PswpItemOptions), el)
}

export const jsonEqual = (val1: any, val2: any) => JSON.stringify(val1) === JSON.stringify(val2)

type SetSizeType = 'src' | 'msrc'

export const setSizeToTarget = (item: ParsedItem, type: SetSizeType): void => {
    /* eslint-disable no-param-reassign */
    const src = item[type]
    if (!src) return
    const img = new Image()
    img.src = src
    const { width, height } = img
    item.w = width
    item.h = height
    if (type === 'src' && width && height) {
        item.el.dataset.pswpSize = `${width}x${height}`
    }
}

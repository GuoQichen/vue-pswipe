import PhotoSwipe from 'photoswipe'
import defaultUI from 'photoswipe/dist/photoswipe-ui-default'
import {
    PswpItem,
    Size,
    FindIndex,
    Closest,
    Get,
    Single,
    PswpDirectiveOptions,
    CreatePhotoSwipe,
    BindEvent,
    HandleWithoutSize,
    Pswp,
} from '@/type'
import { customEvents } from './config'

export const isMobile = (): boolean => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export const isNum = (value: any): value is number => typeof value === 'number'

export const isStr = (value: any): value is string => typeof value === 'string'

export const isObj = (value: any): value is object => Object.prototype.toString.call(value) === '[object Object]'

export const isFunction = (value: any): value is Function => Object.prototype.toString.call(value) === '[object Function]'

const isDef = (value: any): boolean => (value !== undefined) && (value !== null)

export const isImg = (el: HTMLElement): el is HTMLImageElement => el.tagName === 'IMG'

const isEle = (node: Node): node is HTMLElement => node.nodeType === 1

export const isBgImg = (el: HTMLElement): boolean => !isImg(el) && !!el.dataset.pswpSrc

/**
 * default error handle method
 * @param hint error hint
 */
export const errorHandler = (hint: string): never => {
    throw new Error(
        `[vue-pswipe] ${hint}`,
    )
}

/**
 * get image size by polling
 * @param path the image src to get size
 * @return return promise
 */
export const getImageSize = (path: string) => new Promise<Size>((resolve) => {
    const img = new Image()
    let timer: number
    img.src = path
    img.addEventListener('error', () => {
        clearTimeout(timer)
    })
    const check = () => {
        if (img.width > 0 || img.height > 0) {
            return resolve({
                w: img.width,
                h: img.height,
            })
        }
        timer = window.setTimeout(check, 40)
    }
    check()
})

/**
 * returns the index of the first element predicate returns truthy
 * @param array the array to search
 * @param predicate the function invoked per iteration.
 * @return return the index of the found element, else -1.
 */
export const findIndex: FindIndex = (array, predicate) => {
    let index = -1
    array.some((item, idx) => {
        const result = predicate(item, idx)
        if (result) index = idx
        return result
    })
    return index
}

/**
 * parse picture index and gallery index from URL (#&pid=1&gid=2)
 * @return return parsed hash, eg: { pid: 1, gid: 2 }
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

/**
 * invoke querySelectorAll with specified context
 * @param selector css selector
 * @param context the query context
 * @return return the list of queries
 */
export const querySelectorList = <T extends HTMLElement>(
    selector: string,
    context: HTMLElement | Document = document,
) => [...context.querySelectorAll(selector)] as T[]

/**
 * find nearest parent element
 * @param el begin element
 * @param predicate the function invoked from begin element to body
 * @returns return the found element or false
 */
export const closest: Closest = (el, predicate) =>
    !!el &&
    isEle(el) &&
    (predicate(el) ? el : closest(el.parentNode, predicate))

/**
 * gets the property value at path of object
 * @param context the object to query
 * @param path the path of the property to get
 * @param defaultValue the value returned if the resolved value is undefined or cant resolved
 * @return return the resolved value.
 */
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

/**
 * singleton pattern
 * @param fn the function should be invoked only once
 * @return wrapped function
 */
export const single: Single = (fn) => {
    let result: any
    // eslint-disable-next-line func-names
    return function (this: any, ...args: any[]) {
        return result || (result = fn.apply(this, args))
    }
}

/**
 * append element to document.body
 * @param el the element to be append to body
 * @return return appended element
 */
const append = (el: HTMLElement) => document.body.appendChild(el)

/**
 * append element to body only once
 */
export const appendOnce = single<HTMLElement>(append)

/**
 * set data-pswp-size to element
 * @param el the element to set data-pswp-size
 * @param size the size object contains w and h property
 */
export const setSize = (el: HTMLElement, { w, h }: Size) => el.dataset.pswpSize = `${w}x${h}` // eslint-disable-line

/**
 * get the image src according to auto
 * @param target the element to get the src
 * @param auto is it in auto mode
 */
export const getSrc = (target: HTMLImageElement | HTMLElement, auto: boolean): string => (
    auto && isImg(target)
        ? target.src
        : target.dataset.pswpSrc || ''
)

/**
 * determine whether el is a valid element based on auto and filter
 */
export const relevant = (
    el: HTMLElement,
    auto: boolean,
    filter: (el: HTMLImageElement) => boolean,
): boolean => (
    auto
        ? isImg(el) && filter(el)
        : !!el.dataset.pswpSrc
)

/**
 * Convert the first letter to uppercase
 */
const upperFirst = (str: string) => str.replace(/^\S/, match => match.toUpperCase())

/**
 * convert property to pswp property, eg: src => pswpSrc
 */
const getPswpDataKey = (property: string) => `pswp${upperFirst(property)}`

/**
 * Set pswp data to the data attribute of the specified element
 */
export const setPswpData = (options: PswpDirectiveOptions, el: HTMLElement) => {
    (Object.keys(options) as (keyof PswpDirectiveOptions)[]).forEach((key) => {
        el.dataset[getPswpDataKey(key)] = options[key] // eslint-disable-line
    })
}

/**
 * Set the pswp data according to the type of the parameter
 */
export const setPswpDataByCond = (el: HTMLElement, value: string | PswpDirectiveOptions) => {
    if (isStr(value)) setPswpData({ src: value }, el)
    if (isObj(value)) setPswpData((value as PswpDirectiveOptions), el)
}

/**
 * JSON.stringify to determine whether it is equal
 */
export const jsonEqual = (val1: any, val2: any) => JSON.stringify(val1) === JSON.stringify(val2)

/**
 * set the size of specified src to target item
 */
export const setSizeToTarget = (item: PswpItem, type: 'src' | 'msrc'): void => {
    /* eslint-disable no-param-reassign */
    const src = item[type]
    if (!src) return
    const img = new Image()
    img.src = src
    const { width, height } = img
    item.w = width
    item.h = height
    if (type === 'src' && width && height) {
        setSize(item.el, { w: width, h: height })
    }
}

/**
 * allow listen original PhotoSwipe event in Photoswipe component
 * @param context Photoswipe component
 * @param pswp original PhotoSwipe
 */
const bindEvent: BindEvent = (context, pswp) => {
    Object.keys(context.$listeners)
        .filter(event => !customEvents.includes(event))
        .forEach((event) => {
            const fn = context.$listeners[event]
            if (isFunction(fn)) {
                pswp.listen(event, (...args: any[]) => {
                    context.$emit(event, ...args)
                })
            }
        })
}

/**
 * handle item without set size, use msrc first
 * @param pswp original PhotoSwipe
 */
const handleWithoutSize: HandleWithoutSize = (pswp) => {
    pswp.listen('imageLoadComplete', (index, item: PswpItem) => {
        if (item.el.dataset.pswpSize) return
        setSizeToTarget(item, 'src')
        if (pswp.getCurrentIndex() === index) pswp.invalidateCurrItems()
        pswp.updateSize(true)
    })
    pswp.listen('gettingData', (index, item: PswpItem) => {
        const { w, h, msrc } = item
        if (!msrc || w || h) return
        setSizeToTarget(item, 'msrc')
    })
}

/**
 * get current active PhotoSwipe, else null
 */
export namespace CurrentPswp {
    /* eslint-disable no-shadow */
    let curerntPswp: Pswp | null = null
    export const get = () => curerntPswp
    const setupClean = (pswp: Pswp) => {
        pswp.listen('destroy', () => {
            curerntPswp = null
        })
    }
    export const set = (pswp: Pswp | null) => {
        curerntPswp = pswp
        if (pswp) setupClean(pswp)
    }
}

/**
 * create PhotoSwipe instance, setup listener, init PhotoSwipe
 * @return return created original PhotoSwipe instance
 */
export const createPhotoSwipe: CreatePhotoSwipe = ({
    pswpElement, items, options, context,
}) => {
    const pswp = new PhotoSwipe(pswpElement, defaultUI, items, options)
    bindEvent(context, pswp)
    handleWithoutSize(pswp)
    CurrentPswp.set(pswp)
    pswp.init()
    return pswp
}

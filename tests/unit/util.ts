import PhotoSwipe from 'photoswipe'
import { mount, createLocalVue, shallowMount, ShallowMountOptions, MountOptions } from '@vue/test-utils'
import Photoswipe from '@/components/photoswipe.vue'
import PswpUI from '@/components/pswpUI.vue'
import VuePswipe from '@/main'
import { Pswp } from '@/type'
import { Component } from 'vue'

/**
 * mock photoswipe
 */
jest.mock('photoswipe', () => {
    const OriginalPhotoSwipe = jest.requireActual('photoswipe')
    return jest.fn((...args: any[]) => new OriginalPhotoSwipe(...args))
})

export { PhotoSwipe }

/**
 * handy methods
 */
export namespace PhotoSwipeMock {
    export const getReceiveOptions = () => PhotoSwipe.mock.calls[0][3]
    export const getPswp = () => (PhotoSwipe.mock.results[0].value) as any as Pswp
}

/**
 * create PhotoSwipe instance
 */
export const fakeSrc = 'https://placeimg.com/640/480/any'
const imgSlots = `<img src="${fakeSrc}" v-pswp="'${fakeSrc}'" />`

const commonLocalVue = createLocalVue()
commonLocalVue.use(VuePswipe)

export interface CreatePswpOptions extends MountOptions<Photoswipe> {
    defaultSlots?: string | Component | (string | Component)[]
    withClick?: boolean
}

export const createPswp = ({
    defaultSlots = imgSlots,
    localVue = commonLocalVue,
    withClick = true,
    ...options
}: CreatePswpOptions = {}) => {
    const wrapper = mount(Photoswipe, {
        localVue,
        slots: {
            default: defaultSlots,
        },
        ...options,
    })

    withClick && wrapper.find('img').trigger('click')
    return wrapper
}

export const createPswpUI = (options?: ShallowMountOptions<PswpUI>) =>
    shallowMount(PswpUI, {
        localVue: commonLocalVue,
        ...options,
    })

/**
 * mock load image resource
 */
export namespace mockImageOnload {
    const loadedImgs = new Set()

    const originalImgProtoDesc =
        Object.getOwnPropertyDescriptor(window.Image.prototype, 'src') as PropertyDecorator

    const mockImgProtoDesc = {
        set(this: HTMLImageElement, value: string) {
            loadedImgs.add(value)
            this.dispatchEvent(new CustomEvent('load'))
        },
    }

    const setImgProtoSrc = (enableMock: boolean) => {
        const desc = enableMock
            ? mockImgProtoDesc
            : originalImgProtoDesc

        Object.defineProperty(window.Image.prototype, 'src', desc)
    }

    export const enable = () => setImgProtoSrc(true)
    export const disable = () => {
        setImgProtoSrc(false)
        loadedImgs.clear()
    }
    export const isLoaded = (srcs: string[]) => srcs.every(src => loadedImgs.has(src))
}

/**
 * get fake images
 */
const getRandomSize = () => Math.floor((Math.random() * 1e3) + 1e2)

const getRandomImgSrc = () => {
    const width: number = getRandomSize()
    const height: number = getRandomSize()
    return `https://placeimg.com/${width}/${height}/any`
}

export const getFakeImages = (length: number = 1): string[] =>
    [...Array(length).keys()].map(() => getRandomImgSrc())

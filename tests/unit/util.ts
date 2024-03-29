import PhotoSwipe from 'photoswipe'
import defaultUI from 'photoswipe/dist/photoswipe-ui-default'
import {
    mount,
    createLocalVue,
    shallowMount,
    ShallowMountOptions,
    MountOptions,
} from '@vue/test-utils'
import Photoswipe from '@/components/photoswipe.vue'
import PswpUI from '@/components/pswpUI.vue'
import VuePswipe from '@/main'
import { UI } from '@/utils'
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
    export const getReceiveItems = () => PhotoSwipe.mock.calls[0][2]
    export const getReceiveOptions = () => PhotoSwipe.mock.calls[0][3]
    export const getPswp = () => (PhotoSwipe.mock.results[0].value as any) as Pswp
}

/**
 * create PhotoSwipe instance
 */
export const fakeSrc = 'https://placeimg.com/640/480/any'
const imgSlots = `<img src="${fakeSrc}" v-pswp="'${fakeSrc}'" />`

const commonLocalVue = createLocalVue()
commonLocalVue.use(VuePswipe)

export interface CreatePswpOptions extends MountOptions<Photoswipe> {
    defaultSlots?: string | Component | string | Component[]
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

    const originalImgProtoDesc = Object.getOwnPropertyDescriptor(
        window.Image.prototype,
        'src'
    ) as PropertyDescriptor

    const mockImgProtoDesc = {
        set(this: HTMLImageElement, value: string) {
            if (originalImgProtoDesc.set) {
                originalImgProtoDesc.set.call(this, value)
            }
            loadedImgs.add(value)
            this.dispatchEvent(new CustomEvent('load'))
            const [, width = 0, height = 0] =
                value.match(/https:\/\/placeimg.com\/(\d+)\/(\d+)\/any/) || []
            this.width = +width
            this.height = +height
        },
    } as PropertyDescriptor

    const setImgProtoSrc = (enableMock: boolean) => {
        const desc = enableMock ? mockImgProtoDesc : originalImgProtoDesc

        Object.defineProperty(window.Image.prototype, 'src', desc)
    }

    export const enable = () => setImgProtoSrc(true)
    export const disable = () => {
        setImgProtoSrc(false)
        loadedImgs.clear()
    }
    export const isLoaded = (srcs: string[]) => srcs.every((src) => loadedImgs.has(src))
}

/**
 * get fake images
 */
const getRandomSize = () => Math.floor(Math.random() * 1e3 + 1e2)

const getRandomImgSrc = () => {
    const width: number = getRandomSize()
    const height: number = getRandomSize()
    return `https://placeimg.com/${width}/${height}/any`
}

export const getFakeImages = (length: number = 1): string[] =>
    [...Array(length).keys()].map(() => getRandomImgSrc())

export const createProtoPswp = () => {
    const buttonTemplate = '<button @click="handleClick">open</button>'
    const slideHtml =
        '<div class="hello-slide"><h1>Hello world <a href="http://example.com">example.com</a></h1></div>'

    const wrapper = mount(
        {
            template: buttonTemplate,
            methods: {
                handleClick() {
                    this.$Pswp.open({
                        items: [{ html: slideHtml }],
                    })
                },
            },
        },
        {
            localVue: commonLocalVue,
        }
    )

    wrapper.find('button').trigger('click')

    return wrapper
}

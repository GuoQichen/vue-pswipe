/* eslint-disable import/first */
import {
    PhotoSwipe,
    PhotoSwipeMock,
    createPswp,
    fakeSrc,
    CreatePswpOptions,
} from './util'

import { createLocalVue } from '@vue/test-utils'
import VuePswipe from '@/main'
import Vue, { ComponentOptions } from 'vue'
import { PswpDirectiveOptions } from '@/type'

describe('global function', () => {
    beforeEach(() => {
        expect(PhotoSwipe).not.toHaveBeenCalled()
    })

    afterEach(() => {
        PhotoSwipe.mockClear()
    })

    it('global options', () => {
        const bgOpacity = 0.5
        const optionsLocalVue = createLocalVue()
        optionsLocalVue.use(VuePswipe, {
            bgOpacity,
        })

        createPswp({
            localVue: optionsLocalVue,
        })

        const receiveOptions = PhotoSwipeMock.getReceiveOptions()
        expect(receiveOptions.bgOpacity).toBe(bgOpacity)
    })

    it('allow listening to the original PhotoSwipe event', () => {
        const mock = jest.fn()

        createPswp({
            listeners: {
                gettingData: mock,
            },
        })

        expect(mock).toBeCalled()
    })

    describe('history mode', () => {
        const createHashPswp = (hashPath: string, options?: CreatePswpOptions) => {
            window.history.pushState({}, '', hashPath)

            const wrapper = createPswp({
                withClick: false,
                attachToDocument: true,
                propsData: {
                    options: {
                        history: true,
                    },
                },
                ...options,
            })

            document.body.appendChild(wrapper.vm.$el)

            return wrapper
        }

        it('with history hash', (done) => {
            const wrapper = createHashPswp('/#&gid=1&pid=1')

            setTimeout(() => {
                expect(PhotoSwipe).toBeCalled()
                wrapper.destroy()
                done()
            })
        })

        it('with custom hash', (done) => {
            const customPid = 'custom-first-id'

            const wrapper = createHashPswp(`/#&gid=1&pid=${customPid}`, {
                defaultSlots:
                `
                    <img 
                        src="${fakeSrc}" 
                        data-pswp-src="${fakeSrc}"
                        data-pswp-pid="${customPid}"
                    />
                `,
                propsData: {
                    options: {
                        history: true,
                        galleryPIDs: true,
                    },
                },
            })

            setTimeout(() => {
                expect(PhotoSwipe).toBeCalled()
                wrapper.destroy()
                done()
            })
        })
    })

    describe('v-pswp directive', () => {
        const defaultPswpItem = {
            src: 'https://farm4.staticflickr.com/3894/15008518202_c265dfa55f_h.jpg',
            size: '1600x1600',
            msrc: 'https://farm4.staticflickr.com/3894/15008518202_b016d7d289_m.jpg',
            title: 'this is dummy caption',
            pid: 'custom-pid',
        }

        const createDirectivePswp = ({
            pswpItem = defaultPswpItem,
            ...slotOptions
        }: createDirectivePswpArgs = {}) =>
            createPswp({
                defaultSlots: {
                    data: () => ({
                        pswpItem,
                    }),
                    template:
                    `
                        <img
                            :src="pswpItem.msrc"
                            v-pswp="pswpItem"
                        />
                    `,
                    ...slotOptions,
                },
            })


        it('transform to custom dataset', () => {
            const wrapper = createDirectivePswp()

            expect(wrapper.find('img').vm.$el).toMatchSnapshot()
        })

        it('data-pswp-src shorthand', () => {
            const wrapper = createDirectivePswp({
                pswpItem: fakeSrc,
            })

            const el = wrapper.find('img').vm.$el as HTMLElement

            expect(el.dataset.pswpSrc).toBe(fakeSrc)
        })

        it('update directive value', () => {
            const anotherPswpItem = {
                src: 'https://farm6.staticflickr.com/5591/15008867125_b61960af01_h.jpg',
                size: '1600x1068',
                msrc: 'https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_m.jpg',
                title: 'this is another dummy caption',
                pid: 'another-custom-pid',
            }

            const wrapper = createDirectivePswp({
                methods: {
                    changePswpItem() {
                        this.pswpItem = anotherPswpItem
                    },
                },
            })

            const img = wrapper.find('img')
            const vm = img.vm as ImageComponent

            vm.changePswpItem()
            expect(vm.$el).toMatchSnapshot()
        })
    })
})

interface ImageComponent extends Vue {
    pswpItem: PswpDirectiveOptions
    changePswpItem: () => void
}

type ImageOptions = ComponentOptions<ImageComponent>

interface createDirectivePswpArgs extends ImageOptions {
    pswpItem?: string | PswpDirectiveOptions
}

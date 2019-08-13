/* eslint-disable import/first */
import {
    PhotoSwipe,
    PhotoSwipeMock,
    createPswp,
    createPswpUI,
    fakeSrc,
    mockImageOnload,
    getFakeImages,
} from './util'

import { BeforeOpenEvent, BeforeOpen } from '@/type'

describe('photoswipe.vue', () => {
    beforeEach(() => {
        expect(PhotoSwipe).not.toHaveBeenCalled()
    })

    afterEach(() => {
        PhotoSwipe.mockClear()
    })

    it('render Photoswipe', () => {
        expect(createPswp({
            withClick: false,
        })).toMatchSnapshot()
    })

    describe(':props', () => {
        describe(':options', () => {
            const createOptionsPswp = (options: Record<string, any> = {}) => {
                createPswp({
                    propsData: {
                        options,
                    },
                })

                return PhotoSwipeMock.getReceiveOptions()
            }

            it('render default options', () => {
                const options = createOptionsPswp()
                expect(JSON.stringify(options, null, 2)).toMatchSnapshot()
            })

            it('set options', () => {
                const bgOpacity = 0.5
                const options = createOptionsPswp({
                    bgOpacity,
                })

                expect(options.bgOpacity).toBe(bgOpacity)
            })
        })

        describe(':auto', () => {
            const createAutoPswp = (auto: boolean) =>
                createPswp({
                    defaultSlots: `<img src="${fakeSrc}" />`,
                    propsData: {
                        auto,
                    },
                })

            it('without auto', () => {
                createAutoPswp(false)
                expect(PhotoSwipe).not.toBeCalled()
            })

            it('with auto', () => {
                createAutoPswp(true)
                expect(PhotoSwipe).toBeCalled()
            })
        })

        describe(':bubble', () => {
            const createBubblePswp = (bubble: boolean) => {
                createPswp({
                    defaultSlots:
                    `
                        <div v-pswp="'${fakeSrc}'">
                            <img src="${fakeSrc}" />
                        </div>
                    `,
                    propsData: {
                        bubble,
                    },
                })
            }

            it('without bubble', () => {
                createBubblePswp(false)
                expect(PhotoSwipe).not.toBeCalled()
            })

            it('with bubble', () => {
                createBubblePswp(true)
                expect(PhotoSwipe).toBeCalled()
            })
        })

        describe(':rotate', () => {
            it('set pswpUI rotate', () => {
                const pswpUIWrapper = createPswpUI()

                createPswp({
                    propsData: {
                        rotate: true,
                    },
                })

                expect(pswpUIWrapper.vm.$data.rotate).toBe(true)
            })
        })

        describe(':lazy', () => {
            const createLazyPswp = (lazy: boolean, fakeImageLength: number) => {
                const fakeImages = getFakeImages(fakeImageLength)

                const wrapper = createPswp({
                    withClick: false,
                    defaultSlots: fakeImages.map((src, index) => ({
                        data: () => ({
                            pswpItem: {
                                src,
                            },
                        }),
                        template:
                        `
                            <img
                                id="img-${index}"
                                :src="pswpItem.src"
                                v-pswp="pswpItem"
                            />
                        `,
                    })),
                    propsData: {
                        lazy,
                    },
                })

                return {
                    wrapper,
                    fakeImages,
                }
            }

            beforeEach(() => {
                mockImageOnload.enable()
            })

            afterEach(() => {
                mockImageOnload.disable()
            })

            it('only load current, the previous and the next', () => {
                const len = 10
                const { wrapper, fakeImages } = createLazyPswp(true, len)

                wrapper.find('#img-5').trigger('click')
                const shouldLoadedIndex = [4, 5, 6]

                expect(mockImageOnload.isLoaded(
                    shouldLoadedIndex.map(i => fakeImages[i]),
                )).toBe(true)

                expect(mockImageOnload.isLoaded(
                    [...Array(len).keys()]
                        .filter(i => !shouldLoadedIndex.includes(i))
                        .map(i => fakeImages[i]),
                )).toBe(false)
            })

            it('preload all image', () => {
                const len = 10
                const { wrapper, fakeImages } = createLazyPswp(false, len)

                wrapper.find('#img-5').trigger('click')

                expect(mockImageOnload.isLoaded(
                    [...Array(len).keys()].map(i => fakeImages[i]),
                )).toBe(true)
            })
        })
    })

    describe('@event', () => {
        describe('@beforeOpen', () => {
            const getMock = (continued: boolean) => jest.fn(
                (target: BeforeOpenEvent, next: BeforeOpen) => {
                    next(continued)

                    continued
                        ? expect(PhotoSwipe).toBeCalled()
                        : expect(PhotoSwipe).not.toBeCalled()
                },
            )

            const createBeforeOpenPswp = (continued: boolean) => {
                const mock = getMock(continued)

                createPswp({
                    listeners: {
                        beforeOpen: mock,
                    },
                })

                return {
                    mock,
                }
            }

            it('called with specified parameters', () => {
                const { mock } = createBeforeOpenPswp(true)
                expect(mock.mock.calls[0].length).toBe(2)
            })

            it('abort open PhotoSwipe', () => {
                const { mock } = createBeforeOpenPswp(false)
                expect(mock).toBeCalled()
            })
        })

        describe('@opened', () => {
            it('get pswp from cb', () => {
                const mock = jest.fn()
                const wrapper = createPswp({
                    withClick: false,
                })
                wrapper.vm.$on('opened', mock)

                wrapper.find('img').trigger('click')
                const pswp = PhotoSwipeMock.getPswp()

                expect(mock).toBeCalled()
                expect(mock).toBeCalledWith(pswp)
            })
        })
    })
})

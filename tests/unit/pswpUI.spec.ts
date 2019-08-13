/* eslint-disable import/first */
import {
    PhotoSwipe,
    PhotoSwipeMock,
    createPswp,
    createPswpUI,
    mockImageOnload,
} from './util'

import '@/config'
import { transitionEndEventName } from '@/utils'
import { CurrentPswpItem } from '@/type'

describe('pswpUI.vue', () => {
    beforeEach(() => {
        expect(PhotoSwipe).not.toHaveBeenCalled()
    })

    afterEach(() => {
        PhotoSwipe.mockClear()
    })

    it('render PswpUI ', () => {
        expect(createPswpUI()).toMatchSnapshot()
    })

    describe('rotate function', () => {
        const createRotatePswp = () => {
            const pswpUIWrapper = createPswpUI()

            const pswpWrapper = createPswp({
                propsData: {
                    rotate: true,
                },
            })

            const pswp = PhotoSwipeMock.getPswp()

            return {
                pswp,
                pswpWrapper,
                pswpUIWrapper,
            }
        }

        it('render rotate buttons', () => {
            const pswpUIWrapper = createPswpUI()
            createPswp()
            const getRotateButton = () => pswpUIWrapper.findAll('.pswp__button--rotation')
            const pswp = PhotoSwipeMock.getPswp()

            expect(getRotateButton().length).toBe(0)

            pswpUIWrapper.setData({
                rotate: true,
            })
            expect(getRotateButton().length).toBe(2)

            pswp.destroy()
            expect(getRotateButton().length).toBe(0)
        })

        it('handleRotate', () => {
            mockImageOnload.enable()
            const { pswp, pswpUIWrapper } = createRotatePswp()
            const currentItem: CurrentPswpItem = pswp.currItem as any
            const img: HTMLImageElement = currentItem.container.lastChild as any

            const rotate = (direction: 'left' | 'right') => {
                pswpUIWrapper.find(`.pswp__button--rotation--${direction}`).trigger('pswpTap')
                img.dispatchEvent(new Event(transitionEndEventName))
            }
            const expectRotateDeg = (deg: number) => {
                expect(img.style.transform).toContain(`rotate(${deg}deg)`)
            }

            expect(img.style.transform).toBeFalsy()

            rotate('right')
            expectRotateDeg(90)

            // vertical
            rotate('right')
            expectRotateDeg(180)

            rotate('left')
            expectRotateDeg(90)
            mockImageOnload.disable()
        })
    })
})

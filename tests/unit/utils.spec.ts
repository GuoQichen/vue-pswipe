import '@/config'
import { Event } from '@/utils'

const MOCK_EVENT = 'mockEvent'

describe('Event', () => {
    let mockFn: jest.Mock
    beforeEach(() => {
        mockFn = jest.fn()
    })

    afterEach(() => {
        mockFn.mockReset()
        Event.off(MOCK_EVENT)
    })

    describe('emit', () => {
        it('invoke register function (without args)', () => {
            Event.on(MOCK_EVENT, mockFn)
            Event.emit(MOCK_EVENT)
            expect(mockFn).toBeCalled()
        })

        it('invoke register function (with args)', () => {
            const args = [1, 2, 3]
            Event.on(MOCK_EVENT, mockFn)
            Event.emit(MOCK_EVENT, ...args)
            expect(mockFn).toBeCalledWith(...args)
        })

        it('no invoke unregister function (registered event)', () => {
            Event.emit(MOCK_EVENT, mockFn)
            expect(mockFn).not.toBeCalled()
        })

        it('no invoke unregister function (unregister event)', () => {
            Event.emit('otherMockEvent', mockFn)
            expect(mockFn).not.toBeCalled()
        })
    })

    describe('once', () => {
        it('invoke register function once', () => {
            Event.once(MOCK_EVENT, mockFn)
            Event.emit(MOCK_EVENT)
            Event.emit(MOCK_EVENT)
            expect(mockFn).toBeCalledTimes(1)
        })
    })

    describe('off', () => {
        it('clear all register function by event name', () => {
            const otherMockFn = jest.fn()
            Event.on(MOCK_EVENT, mockFn)
            Event.on(MOCK_EVENT, otherMockFn)
            Event.off(MOCK_EVENT)
            expect(mockFn).not.toBeCalled()
            expect(otherMockFn).not.toBeCalled()
        })

        it('clear register function by returned value by on', () => {
            Event.on(MOCK_EVENT, mockFn)()
            expect(mockFn).not.toBeCalled()
        })

        it('clear register function by function ref (correct ref)', () => {
            Event.on(MOCK_EVENT, mockFn)
            Event.off(MOCK_EVENT, mockFn)
            expect(mockFn).not.toBeCalled()
        })

        it('clear register function by function ref (incorrect ref)', () => {
            Event.on(MOCK_EVENT, mockFn)
            Event.off(MOCK_EVENT, jest.fn())
            Event.emit(MOCK_EVENT)
            expect(mockFn).toBeCalled()
        })
    })
})

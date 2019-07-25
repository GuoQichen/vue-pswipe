import { shallowMount } from '@vue/test-utils'
import '@/config'
import PswpUI from '@/components/pswpUI.vue'

describe('pswp.vue', () => {
    it('render PswpUI correctly', () => {
        expect(shallowMount(PswpUI)).toMatchSnapshot()
    })
})

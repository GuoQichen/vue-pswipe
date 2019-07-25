import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import Photoswipe from '@/components/photoswipe.vue'

describe('photoswipe.vue', () => {
    it('render Photoswipe correctly', () => {
        expect(shallowMount(Photoswipe)).toMatchSnapshot()
    })
})

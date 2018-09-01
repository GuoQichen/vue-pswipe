import Photoswipe from './components/photoswipe.vue'
import ImageItem from './components/imageItem.vue'
import Pswp from './components/pswp.vue'
import { getGlobalMixin } from './config'

export default {
    install(Vue, options) {
        const pswp = new Vue(Pswp).$mount()

        Vue.component('Photoswipe', {
            mixins: [getGlobalMixin(pswp, options)],
            ...Photoswipe,
        })
        Vue.component('PhotoswipeItem', ImageItem)
    },
}

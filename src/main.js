import Photoswipe from './components/photoswipe.vue'
import ImageItem from './components/imageItem.vue'

export default {
    install(Vue, options) {
        Vue.component('Photoswipe', {
            data() {
                return {
                    globalOptions: options,
                }
            },
            ...Photoswipe,
        })
        Vue.component('PhotoswipeItem', ImageItem)
    },
}

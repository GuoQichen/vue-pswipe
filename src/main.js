import Photoswipe from './components/photoswipe.vue'
import ImageItem from './components/imageItem.vue'

const getGlobalMixin = options => ({
    data() {
        return {
            globalOptions: options,
        }
    },
})

export default {
    install(Vue, options) {
        Vue.component('Photoswipe', {
            mixins: [getGlobalMixin(options)],
            ...Photoswipe,
        })
        Vue.component('PhotoswipeItem', ImageItem)
    },
}

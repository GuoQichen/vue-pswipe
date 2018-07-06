import getPhotoswipe from './photoswipe'
import ImageItem from './components/imageItem.vue'

export default {
    install(Vue, options) {
        const Photoswipe = getPhotoswipe(options)
        Vue.component(Photoswipe.name, Photoswipe)
        Vue.component('PhotoswipeItem', ImageItem)
    },
}

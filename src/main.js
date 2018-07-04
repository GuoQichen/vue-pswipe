import PhotoSwipe from './index.vue'
import ImageItem from './components/imageItem.vue'

export default {
    install(Vue) {
        Vue.component(PhotoSwipe.name, PhotoSwipe)
        Vue.component('PhotoswipeItem', ImageItem)
    },
}

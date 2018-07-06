import { isObject, isFunction, flatMap } from './utils'
import photoswipe from './components/photoswipe.vue'
import imageItem from './components/imageItem.vue'

export default (options = {}) => ({
    name: 'Photoswipe',
    components: {
        photoswipe,
        imageItem,
    },
    props: {
        imageList: {
            type: Array,
            default: () => [],
        },
        options: Object, // original photoswipe
    },
    render(h) {
        const list = flatMap(this.imageList, ((item, index) => {
            if (isObject(item) && !item.src) {
                return isFunction(this.$scopedSlots.default) &&
                    this.$scopedSlots.default({ item, index })
            }
            return h('imageItem', {
                key: index,
                props: {
                    item,
                    index,
                },
                attrs: { ...this.$attrs }, // prevent only first imageItem get props
                scopedSlots: this.$scopedSlots,
            })
        }))

        return h('photoswipe', {
            props: {
                options: { ...options, ...this.options },
            },
            class: 'photoswipe',
        }, [...list].concat(this.$slots.default))
    },
})

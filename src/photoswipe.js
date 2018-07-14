import {
    isObject,
    isFunction,
    flatMap,
} from './utils'
import photoswipe from './components/photoswipe.vue'
import imageItem from './components/imageItem.vue'

export default (options = {}) => ({
    name: 'Photoswipe',
    components: {
        photoswipe,
        imageItem,
    },
    props: {
        imageField: {
            type: String,
            default: 'src',
        },
        imageList: {
            type: Array,
            default: () => [],
        },
        options: Object, // original photoswipe
    },
    render(h) {
        const list = flatMap(this.imageList, ((item, index) => {
            if (isObject(item) && !item[this.imageField]) {
                return isFunction(this.$scopedSlots.default) &&
                    this.$scopedSlots.default({ item, index })
            }
            return h('imageItem', {
                key: index,
                props: {
                    item,
                    index,
                    imageField: this.imageField,
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

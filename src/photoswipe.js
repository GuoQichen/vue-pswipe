import {
    isObject,
    isFunction,
    flatMap,
    setImageField,
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
        imageField: String,
        imageList: {
            type: Array,
            default: () => [],
        },
        options: Object, // original photoswipe
    },
    methods: {
        setImageFieldBatch() {
            if (
                !Array.isArray(this.imageList) ||
                !this.$props.imageField
            ) return

            this.imageList.forEach((item) => {
                if (!isObject(item)) return
                setImageField(item, this.imageField)
            })
        },
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
    watch: {
        imageList: {
            handler: 'setImageFieldBatch',
            immediate: true,
        },
    },
})

<script>
import photoswipe from './components/photoswipe.vue'
import imageItem from './components/imageItem.vue'

export default {
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
        return h('photoswipe', {
            props: {
                options: this.options,
            },
        }, this.imageList.map((item, index) =>
            h('imageItem', {
                key: index,
                props: {
                    item,
                    index,
                },
                attrs: { ...this.$attrs }, // prevent only first imageItem get props
                scopedSlots: this.$scopedSlots,
            })).concat(this.$slots.default),
        )
    },
}
</script>


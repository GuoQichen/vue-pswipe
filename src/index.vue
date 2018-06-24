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
    },
    render(h) {
        return h('photoswipe', {}, this.imageList.map((image, index) =>
            h('imageItem', {
                key: index,
                props: {
                    imageItem: image,
                },
                scopedSlots: this.$scopedSlots,
            }),
        ))
    },
}
</script>


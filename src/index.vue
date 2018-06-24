<template>
    <div class="photoswipe">
        <photoswipe>
            <figure
                itemscope
                itemprop="associatedMedia"
                itemtype="http://schema.org/ImageObject"

                v-for="(image, index) in imageListWithSize"
                :key="index"
            >
				<a
                    class="photoswipe__a"
                    itemprop="contentUrl"
                    :href="image.src"
                    :data-size="image.size"
                >
                    <slot :image="image">
                        <img
                            class="photoswipe__image"
                            :src="image.src"
                            alt="图片"
                        />
                    </slot>
				</a>
			</figure>
        </photoswipe>
    </div>
</template>
<script>
import photoswipe from './photoswipe.vue'
import { getImageSize } from './utils'

export default {
    name: 'Photoswipe',
    components: {
        photoswipe,
    },
    props: {
        imageList: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            imageListWithSize: [],
        }
    },
    mounted() {
        Promise.all(this.imageList.map(image =>
            getImageSize(image).then(({ w, h }) => ({
                src: image,
                size: `${w}x${h}`,
            })))).then((results) => {
            this.imageListWithSize = results
        })
    },
}
</script>
<style lang="less" scoped>
.photoswipe {
    &__a {
        display: inline-block;
        vertical-align: middle;
    }
    &__image {
        width: 100%;
        vertical-align: middle;
    }
}
</style>


<template>
     <figure
        itemscope
        itemprop="associatedMedia"
        itemtype="http://schema.org/ImageObject"
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
                    itemprop="thumbnail"
                    :src="image.src"
                    alt="图片"
                />
            </slot>
        </a>
    </figure>
</template>
<script>
import { getImageSize } from '../utils'

export default {
    name: 'ImageItem',
    props: {
        imagePath: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            image: {
                src: '',
                size: '0x0',
            },
        }
    },
    mounted() {
        getImageSize(this.imagePath).then(({ w, h }) => {
            this.image = {
                src: this.imagePath,
                size: `${w}x${h}`,
            }
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


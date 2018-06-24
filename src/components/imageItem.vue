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
import isPlainObject from 'lodash/isPlainObject'
import isString from 'lodash/isString'

import {
    getImageSize,
    getImagePath,
    getInitialImage,
} from '../utils'

export default {
    name: 'ImageItem',
    props: {
        imageItem: {
            validator(value) {
                return isString(value) || (isPlainObject(value) && value.src)
            },
        },
    },
    data() {
        const path = getImagePath(this.imageItem)
        const initialImage = getInitialImage(this.imageItem)
        return {
            image: initialImage,
            imagePath: path,
        }
    },
    created() {
        getImageSize(this.imagePath).then(
            ({ w, h }) => {
                this.image = {
                    ...this.image,
                    size: `${w}x${h}`,
                }
            },
        )
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


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
        return {
            image: {
                src: path,
                size: '0x0',
            },
            imagePath: path,
        }
    },
    methods: {
        handleGetSize({ w, h }) {
            const size = `${w}x${h}`

            if (isString(this.imageItem)) {
                this.image = {
                    src: this.imagePath,
                    size,
                }
            } else {
                this.image = {
                    ...this.imageItem,
                    size,
                }
            }
        },
    },
    created() {
        getImageSize(this.imagePath).then(this.handleGetSize)
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


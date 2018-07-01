<template>
    <div
        class="image-wrapper"
        :class="{ inline }"
        :data-src="src"
        :data-size="size"
    >
        <slot
            :item="item"
            :index="index"
            :src="src"
            :size="size"
        >
            <img
                class="photoswipe__image"
                :src="src"
                alt="图片"
            />
        </slot>
    </div>
</template>
<script>
import {
    isString,
    isObject,
    getImageSize,
    getImagePath,
} from '../utils'

export default {
    name: 'ImageItem',
    props: {
        item: {
            validator(value) {
                return isString(value) || isObject(value)
            },
        },
        index: {
            type: Number,
            required: true,
        },
        inline: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        const path = getImagePath(this.item)
        return {
            src: path,
            size: '0x0',
        }
    },
    created() {
        getImageSize(this.src).then(
            ({ w, h }) => {
                this.size = `${w}x${h}`
            },
        )
    },
}
</script>
<style lang="less" scoped>
.image-wrapper {
    &.inline {
        display: inline-block;
    }
}
.photoswipe {
    &__image {
        width: 100%;
        vertical-align: middle;
    }
}
</style>


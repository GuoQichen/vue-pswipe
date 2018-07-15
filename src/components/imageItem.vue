<template>
    <div
        class="image-wrapper"
        :data-src="src"
        :data-size="size"
    >
        <slot>
            <img
                class="photoswipe__image"
                :src="src"
                alt="图片"
            />
        </slot>
    </div>
</template>
<script>
import { getImageSize } from '../utils'

export default {
    name: 'PhotoswipeItem',
    props: {
        src: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
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
.photoswipe__image {
    width: 100%;
    vertical-align: bottom;
}
</style>


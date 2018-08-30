<template>
    <div>
        <Photoswipe>
            <PhotoswipeItem
                v-for="(src, index) in imageList"
                :key="index"
                :src="src"
                style="width: 200px;"
            />

            <PhotoswipeItem
                v-for="(src, index) in imageList"
                :key="index+imageList.length"
                :src="src"
            >
                <div
                    class="image-item"
                    :style="getImageItemStyle(src)"
                />
            </PhotoswipeItem>
        </Photoswipe>

        <Photoswipe auto ref="photoswipe">
            <div v-html="htmlTemplate"></div>
            <img
                v-for="(src, index) in imageList"
                :src="src"
                :key="`i-${index}`"
                style="width: 200px;"
            />
        </Photoswipe>
    </div>
</template>
<script>
export default {
    data() {
        return {
            imageList: [
                'https://placeimg.com/640/480/any',
                'https://placeimg.com/640/481/any',
                'https://placeimg.com/640/482/any',
            ],
            htmlTemplate: '',
        }
    },
    methods: {
        getImageItemStyle(src) {
            return {
                width: '200px',
                height: '200px',
                backgroundImage: `url(${src})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }
        },
    },
    mounted() {
        setTimeout(() => {
            this.htmlTemplate = '<img src="https://placeimg.com/640/480/any" style="width: 100%;"/>'
            this.$nextTick(() => {
                this.$refs.photoswipe.setImageSize()
            })
        }, 1e3)
    },
}
</script>

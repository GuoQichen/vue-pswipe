<template>
    <div>
        <Photoswipe>
            <img
                v-for="(src, index) in imageList"
                :key="index"
                :src="src"
                :data-pswp-src="src"
                style="width: 200px;"
            />

            <div
                v-for="(src, index) in imageList"
                :data-pswp-src="src"
                :key="`bg-${index}`"
                :style="getImageItemStyle(src)"
            />
        </Photoswipe>

        <Photoswipe auto ref="photoswipe">
            <div v-html="htmlTemplate"></div>
            <img
                v-for="(src, index) in imageList"
                :src="src"
                :key="`auto-${index}`"
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
                'http://img.dxycdn.com/dxycare/2018/07/05/201807051426215b3dba0d6749c.png',
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
        }, 1e3)
    },
}
</script>

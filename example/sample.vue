<template>
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

        <img
            v-for="(src, index) in imageList"
            :src="src"
            class="photoswipe-item"
            :key="`i-${index}`"
            style="width: 200px;"
        />
    </Photoswipe>
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
}
</script>

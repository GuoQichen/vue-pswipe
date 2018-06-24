import Vue from 'vue/dist/vue'
import PhotoswipePlugin from '../src/main'

Vue.use(PhotoswipePlugin)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    data() {
        return {
            imageList: [
                'https://placeimg.com/640/480/any',
                'https://placeimg.com/640/481/any',
                'https://placeimg.com/640/482/any',
            ],
        }
    },
    computed: {
        imageItemList() {
            return this.imageList.map(path => ({
                src: path,
                hello: 'world',
            }))
        },
    },
    methods: {
        getImageItemStyle(image) {
            return {
                width: '100px',
                height: '100px',
                backgroundImage: `url(${image.src})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }
        },
    },
    template: `
        <div>
            <h2>default </h2>
            <Photoswipe :imageList="imageList" />

            <h2>use img element</h2>
            <Photoswipe :imageList="imageList">
                <template slot-scope="{ image }">
                    <img :src="image.src" style="width: 100%"/>
                </template>
            </Photoswipe>

            <h2>use image-item class</h2>
            <Photoswipe :imageList="imageItemList">
                <template slot-scope="{ image }">
                    <div :style="getImageItemStyle(image)" class="image-item" />
                </template>
            </Photoswipe>
        </div>
    `,
})

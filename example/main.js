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
        getImageItemStyle(src) {
            return {
                width: '100px',
                height: '100px',
                backgroundImage: `url(${src})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }
        },
    },
    // FIXME: history options will be shared, because new Photoswipe is single instance
    template: `
        <div>
            <h2>default </h2>
            <Photoswipe :imageList="imageList"/>

            <h2>use img element</h2>
            <Photoswipe :imageList="imageList">
                <template slot-scope="{ src }">
                    <img :src="src" style="width: 100%"/>
                </template>
            </Photoswipe>

            <h2>use image-item class</h2>
            <Photoswipe :imageList="imageItemList">
                <template slot-scope="{ src, size, index }">
                    <div :style="getImageItemStyle(src)" class="image-item" />
                    {{ index + 1 }}. {{ size }}
                </template>
                <div>append</div>
            </Photoswipe>
        </div>
    `,
})

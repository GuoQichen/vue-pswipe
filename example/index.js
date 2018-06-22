import Vue from 'vue'
import PhotoswipePlugin from '../src/index'

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
    template: `
        <Photoswipe :imageList="imageList">
            <template slot-scope="{ image }">
                <img :src="image.src" style="width: 100%"/>
            </template>
        </Photoswipe>
    `,
})

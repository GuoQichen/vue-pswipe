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
            discontinueImageList: [
                { type: 'text', content: 'message' },
                { type: 'text', content: 'message' },
                { type: 'image', src: 'https://placeimg.com/640/480/any' },
                { type: 'text', content: 'message' },
                { type: 'image', src: 'https://placeimg.com/640/480/any' },
                { type: 'text', content: 'message' },
            ],
        }
    },
    computed: {
        imageListWithOtherField() {
            return this.imageList.map(path => ({
                image: path,
            }))
        },
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
    // FIXME: history options will be shared
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

            <h2>dicontinued image</h2>
            <Photoswipe :imageList="discontinueImageList">
                <template slot-scope="{ src, size, index, item }">
                    <div 
                        v-if="item.type === 'text'"
                        class="text"
                    >
                        {{ item.content }}
                    </div>
                    <div
                        v-else 
                        class="image-item"
                        :style="getImageItemStyle(src)" 
                    />
                    <div>
                        {{ index }}
                    </div>
                </template>
            </Photoswipe>

            <h2>customize render</h2>
            <Photoswipe>
                hello customize render
                <PhotoswipeItem :item="imageList[0]">
                    <img 
                        slot-scope="{ src }"
                        :src="src"
                        style="width: 100px"
                    />
                </PhotoswipeItem>
                we can add anything i want, then render
                <PhotoswipeItem :item="imageList[1]">
                    <img 
                        slot-scope="{ src }"
                        :src="src"
                        style="width: 100px"
                    />
                </PhotoswipeItem>
            </Photoswipe>

            <h2>set image field instead src</h2>
            <Photoswipe 
                imageField="image"
                :imageList="imageListWithOtherField"
            />
        </div>
    `,
})

<template>
    <div>
        <Photoswipe bubble rotate>
            <h2>use img tag</h2>
            <img
                v-for="(src, index) in imageList"
                :key="index"
                :src="src"
                v-pswp="src"
                style="width: 200px;"
            />

            <h2>use background-image</h2>
            <div
                v-for="(src, index) in imageList"
                v-pswp="src"
                :key="`bg-${index}`"
                :style="getImageItemStyle(src)"
                style="display: inline-block;"
            />

            <h2>use batch</h2>
            <div
                v-for="(item, index) in getBatchImages(100)"
                v-pswp="item"
                :key="`batch-bg-${index}`"
                :style="getImageItemStyle(imageList[0])"
                style="display: inline-block;"
            />

            <h2>use bubble mode</h2>
            <div
                v-pswp="imageList[0]"
                style="display: inline-block;"
            >
                <button>click to preview (button inside element with v-pswp directive)</button>
            </div>

            <h2>dynamic property</h2>
            <div
                :style="getImageItemStyle(dynamicSrc)"
                v-pswp="dynamicSrc"
            />
            <button @click="changeSrc">change src</button>

            <h2>use msrc option</h2>
            <img
                v-for="(item, index) in completeImageList"
                :key="`complete-${index}`"
                :src="item.msrc"
                v-pswp="item"
                style="width: 200px;"
            />
        </Photoswipe>

        <Photoswipe auto ref="photoswipe" @beforeOpen="handleBeforeOpen">
            <h2>use dynamic template</h2>
            <button @click="handleInsert">dynamic insert htmlTemplate</button>
            <div v-html="htmlTemplate"></div>

            <h2>use auto mode</h2>
            <img
                v-for="(src, index) in imageList"
                :src="src"
                :key="`auto-${index}`"
                style="width: 200px;"
            />

            <h2>use beforeOpen hook</h2>
            <a href="javascipt: void(0)">
                <img
                    :src="imageList[0]"
                    style="width: 200px;"
                />
            </a>
        </Photoswipe>
    </div>
</template>
<script lang="ts">
// eslint-disable-next-line import/no-extraneous-dependencies
import { Vue, Component } from 'vue-property-decorator'
import { BeforeOpenEvent, BeforeOpen, Pswp } from '@/type'

const getRandomSize = () => Math.floor((Math.random() * 1e3) + 1e2)

const getRandomImgSrc = () => {
    const width: number = getRandomSize()
    const height: number = getRandomSize()
    return `https://placeimg.com/${width}/${height}/any`
}

@Component({ name: 'sample' })
export default class Sample extends Vue {
    dynamicSrc = 'https://placeimg.com/640/480/any'
    imageList = [
        'https://placeimg.com/640/480/any',
        'https://placeimg.com/640/481/any',
        'https://placeimg.com/640/482/any',
    ]
    completeImageList = [
        {
            src: 'https://farm4.staticflickr.com/3894/15008518202_c265dfa55f_h.jpg',
            size: '1600x1600',
            msrc: 'https://farm4.staticflickr.com/3894/15008518202_b016d7d289_m.jpg',
            title: 'this is dummy caption',
        },
        {
            src: 'https://farm6.staticflickr.com/5591/15008867125_b61960af01_h.jpg',
            size: '1600x1068',
            msrc: 'https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_m.jpg',
            title: 'this is dummy caption',
        },
        {
            src: 'https://farm4.staticflickr.com/3902/14985871946_24f47d4b53_h.jpg',
            size: '1600x1067',
            msrc: 'https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_m.jpg',
            title: 'this is dummy caption',
        },
    ]
    htmlTemplate = ''

    getImageItemStyle(src: string) {
        return {
            width: '200px',
            height: '200px',
            backgroundImage: `url(${src})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
        }
    }

    handleInsert() {
        this.htmlTemplate = '<img src="https://placeimg.com/640/480/any" style="width: 200px;"/>'
    }

    handleBeforeOpen({
        index, target,
    }: BeforeOpenEvent, next: BeforeOpen) {
        if (target.parentElement && target.parentElement.tagName !== 'A') {
            next()
        }
    }

    changeSrc() {
        this.dynamicSrc = 'https://placeimg.com/600/320/any'
    }

    getBatchImages(length: number) {
        const msrc = getRandomImgSrc()
        const results = Array(length).fill('').map(() => ({
            src: getRandomImgSrc(),
            msrc: this.imageList[0],
        }))
        return results
    }
}
</script>

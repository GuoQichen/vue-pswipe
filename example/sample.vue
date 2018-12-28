<template>
    <div>
        <Photoswipe bubble>
            <h2>use img tag</h2>
            <img
                v-for="(src, index) in imageList"
                :key="index"
                :src="src"
                :data-pswp-src="src"
                style="width: 200px;"
            />

            <h2>use background-image</h2>
            <div
                v-for="(src, index) in imageList"
                :data-pswp-src="src"
                :key="`bg-${index}`"
                :style="getImageItemStyle(src)"
            />

            <h2>use bubble mode</h2>
            <div
                v-for="(src, index) in imageList"
                :data-pswp-src="src"
                :key="`bubble-${index}`"
                style="marginBottom: 20px;"
            >
                <div :style="getImageItemStyle(src)" />
                <div class="child" style="padding: 10px 0;">this is a child</div>
            </div>
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
                    v-for="(src, index) in imageList"
                    :src="src"
                    :key="`hook-${index}`"
                    style="width: 200px;"
                />
            </a>
        </Photoswipe>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

interface BeforeOpenEvent {
    index: number
    target: HTMLElement
}

type BeforeOpenNext = (continued?: boolean) => void

@Component({ name: 'sample' })
export default class Sample extends Vue {
    imageList = [
        'https://placeimg.com/640/480/any',
        'https://placeimg.com/640/481/any',
        'https://placeimg.com/640/482/any',
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
    }: BeforeOpenEvent, next: BeforeOpenNext) {
        if (target.parentElement && target.parentElement.tagName !== 'A') {
            next()
        }
    }
}
</script>

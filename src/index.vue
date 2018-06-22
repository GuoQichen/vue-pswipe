<template>
    <div class="photoswipe">
        <photoswipe>
            <figure 
                itemscope 
                itemprop="associatedMedia" 
                itemtype="http://schema.org/ImageObject"

                v-for="(image, index) in imageListWithSize"
                :key="index"
            >
				<a 
                    itemprop="contentUrl" 
                    :href="image.src" 
                    :data-size="image.size"
                >
                    <slot :image="image">
                        <img
                            :src="image.src"
                            alt="图片"
                        />
                    </slot>
				</a>
			</figure>
        </photoswipe>
    </div>
</template>
<script>
import photoswipe from './photoswipe.vue'
import { getImageSize } from './utils.js'

export default {
    name: 'Photoswipe',
    components: {
        photoswipe
    },
    props: {
        imageList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            imageListWithSize: []
        }
    },
    mounted() {
        Promise.all(
            this.imageList.map(image => 
                getImageSize(image).then(
                    ({ w, h }) => ({
                        src: image,
                        size: `${w}x${h}`
                    })
                )
            )
        ).then(results => 
            this.imageListWithSize = results
        )
    },
}
</script>


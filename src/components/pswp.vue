<template>
    <!-- Root element of PhotoSwipe. Must have class pswp. -->
    <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

        <!-- Background of PhotoSwipe.
            It's a separate element as animating opacity is faster than rgba(). -->
        <div class="pswp__bg"></div>

        <!-- Slides wrapper with overflow:hidden. -->
        <div class="pswp__scroll-wrap">

            <!-- Container that holds slides.
                PhotoSwipe keeps only 3 of them in the DOM to save memory.
                Don't modify these 3 pswp__item elements, data is added later on. -->
            <div class="pswp__container">
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
            </div>

            <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
            <div class="pswp__ui pswp__ui--hidden">

                <div class="pswp__top-bar">

                    <!--  Controls are self-explanatory. Order can be changed. -->

                    <div class="pswp__counter"></div>

                    <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

                    <button class="pswp__button pswp__button--share" title="Share"></button>

                    <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

                    <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

                    <button
                        class="pswp__button pswp__button--rotation pswp__button--rotation--right"
                        title="Rotate Right"
                        @click="handleRotate('right')"
                        @touchstart="handleRotate('right')"
                    />

                    <button
                        class="pswp__button pswp__button--rotation pswp__button--rotation--left"
                        title="Rotate Left"
                        @click="handleRotate('left')"
                        @touchstart="handleRotate('left')"
                    />

                    <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
                    <!-- element will get class pswp__preloader--active when preloader is running -->
                    <div class="pswp__preloader">
                        <div class="pswp__preloader__icn">
                        <div class="pswp__preloader__cut">
                            <div class="pswp__preloader__donut"></div>
                        </div>
                        </div>
                    </div>
                </div>

                <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                    <div class="pswp__share-tooltip"></div>
                </div>

                <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
                </button>

                <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
                </button>

                <div class="pswp__caption">
                    <div class="pswp__caption__center"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Pswp as PswpType, RotateDirection, CurrentPswpItem } from '@/type'
import { getTransformStyle } from '@/utils'

@Component({ name: 'Pswp' })
export default class Pswp extends Vue {
    $Pswp!: PswpType

    handleRotate(direction: 'left' | 'right') {
        const { container } = this.$Pswp
        const currentItem = this.$Pswp.currItem as CurrentPswpItem
        const img = currentItem.container.lastChild as HTMLImageElement

        if (!currentItem.loaded) return
        const containerWidth = container.clientWidth
        const containerHeight = currentItem.vGap
            ? container.clientHeight - currentItem.vGap.top - currentItem.vGap.bottom
            : container.clientHeight

        const deg = Number(img.dataset.rotateDeg) || 0
        const offsets = direction === 'left' ? -90 : 90
        const transformDeg = deg + offsets

        img.dataset.rotateDeg = `${transformDeg}`
        img.style.transform = getTransformStyle(
            { w: containerWidth, h: containerHeight },
            img,
            transformDeg,
        )
    }
}
</script>
<style lang="scss">
$rotateIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAASBJREFUeNqk00FLAkEYxnFHuwidypQ6eOkcgVcvWtkp7CiiR+ki9AUEP0mIXf0A1SUkhEAkwnOGQaghCtJF8OD2f2UWh0Fpy4Hfws7su+8y86xyHMe3yfCvmNvGNZ4whnTooYY0lPmwsr7gDLc4wCseMEEIp4jhGTl8LCrkBVoaM7wjacybEvhEH4eL5lwqOMc3OoisKXbto4smlEy86c5TXP1S7JKGMjJy03CWY46Cx5e0cS+n8KU3sIML3Hg8wTqO/bqwjCPc/SECQ+xucSlh/o8MhSUnaoMkttH3edwwW0pvetZeiCPsMQctBMyFHQx1EhNrik90EgduEu09SKKKKF7wiBH2rH8hj679L7iCKKKOiU6pdK3hUuJrPv8jwAASlMcqHuTzOgAAAABJRU5ErkJggg==';

.pswp__button--rotation {
    background-position: center;
    background-repeat: no-repeat;
    background-size: auto;
    &#{&}--left {
        background-image: url($rotateIcon);
    }
    &#{&}--right {
        background-image: url($rotateIcon);
        transform: rotateY(180deg);
    }
}
.pswp__img {
   transition: transform .3s;
}
</style>


<template>
    <div class="wrap">
        <video ref="videoPlayer" class="video-js vjs-big-play-centered" playsInline webkit-playsinline="true"></video>
    </div>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export default {
    name: 'VideoPlayer',
    props: {
        options: {
            type: Object,
            default() {
                return {}
            },
        },
    },
    data() {
        return {
            player: null,
        }
    },
    mounted() {
        this.player = videojs(this.$refs.videoPlayer, {
            fluid: true,
            controls: true,
            sources: [{
                src: 'http://vjs.zencdn.net/v/oceans.mp4',
                type: 'video/mp4',

            }],
        }, () => {
            // prevent swipe conflict
            this.player.getChild('controlBar').el_.addEventListener('pointerdown', e => e.stopPropagation())
        })
    },
    beforeDestroy() {
        if (this.player) {
            this.player.dispose()
        }
    },
}
</script>
<style scoped>
.wrap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

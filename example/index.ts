import Vue, { CreateElement } from 'vue' // eslint-disable-line
import PhotoswipePlugin from '../src/main'
// import PhotoswipePlugin from '../dist/Photoswipe.umd'
import Sample from './sample.vue'

Vue.use(PhotoswipePlugin, {
    // history: true,
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: {
        Sample,
    },
    render: (h: CreateElement) => h(Sample),
})

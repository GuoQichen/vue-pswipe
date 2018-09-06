import Vue from 'vue/dist/vue'
import PhotoswipePlugin from '../src/main'
// import PhotoswipePlugin from '../dist/Photoswipe.umd'
import sample from './sample.vue'

Vue.use(PhotoswipePlugin, {
    // history: true,
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: {
        sample,
    },
    template: '<sample />',
})

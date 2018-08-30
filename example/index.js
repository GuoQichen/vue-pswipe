import Vue from 'vue/dist/vue'
import PhotoswipePlugin from '../src/main'
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

import { PluginFunction } from 'vue' // eslint-disable-line
import { getGlobalMixin } from './config'
import { Options } from './type/index.d'
import Photoswipe from './components/photoswipe.vue'
import Pswp from './components/pswp.vue'

const install: PluginFunction<Options> = (Vue, options?: Options) => {
    const pswp = new Vue(Pswp).$mount()

    Photoswipe.mixin(getGlobalMixin(pswp, options))

    Vue.component('Photoswipe', Photoswipe)
}

export default {
    install,
}

import { PluginFunction } from 'vue' // eslint-disable-line
import { getGlobalMixin } from './config'
import { setPswpDataByCond, jsonEqual } from './utils'
import { Options } from './type/index.d'
import Photoswipe from './components/photoswipe.vue'
import Pswp from './components/pswp.vue'

const install: PluginFunction<Options> = (Vue, options?: Options) => {
    const pswp = new Vue(Pswp).$mount()

    Photoswipe.mixin(getGlobalMixin(pswp, options))

    Vue.component('Photoswipe', Photoswipe)
    Vue.directive('pswp', {
        bind(el: HTMLElement, { value }: any) {
            setPswpDataByCond(el, value)
        },
        update(el: HTMLElement, { value, oldValue }: any) {
            if (jsonEqual(value, oldValue)) return
            setPswpDataByCond(el, value)
        },
    })
}

export default {
    install,
}

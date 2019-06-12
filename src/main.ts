import { PluginFunction } from 'vue' // eslint-disable-line
import { PswpOptions } from '@/type'
import { getGlobalMixin } from './config'
import { setPswpDataByCond, jsonEqual, CurrentPswp } from './utils'
import Photoswipe from './components/photoswipe.vue'
import Pswp from './components/pswp.vue'

const install: PluginFunction<PswpOptions> = (Vue, options?: PswpOptions) => {
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

    Object.defineProperty(Vue.prototype, '$Pswp', {
        get() {
            return CurrentPswp.get()
        },
    })
}

export default {
    install,
}

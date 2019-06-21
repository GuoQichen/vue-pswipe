import { PluginFunction } from 'vue' // eslint-disable-line
import { PswpOptions } from '@/type'
import { GlobalOption } from '@/config'
import { setPswpDataByCond, CurrentPswp, UI } from '@/utils'
import Photoswipe from '@/components/photoswipe.vue'
import PswpUI from '@/components/pswpUI.vue'

const install: PluginFunction<PswpOptions> = (Vue, options?: PswpOptions) => {
    if (options) GlobalOption.extend(options)

    const PswpUIComponent = new Vue(PswpUI).$mount()
    UI.el = <HTMLElement>PswpUIComponent.$el

    Vue.component('Photoswipe', Photoswipe)

    Vue.directive('pswp', {
        bind(el: HTMLElement, { value }: any) {
            setPswpDataByCond(el, value)
        },
        update(el: HTMLElement, { value, oldValue }: any) {
            if (value === oldValue) return
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

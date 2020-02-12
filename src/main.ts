import { PluginFunction } from 'vue' // eslint-disable-line
import { PswpOptions } from '@/type'
import { GlobalOption } from '@/config'
import { CurrentPswp, registerDirective } from '@/utils'
import PhotoswipeComponent from '@/components/photoswipe.vue'

const install: PluginFunction<PswpOptions> = (Vue, options?: PswpOptions) => {
    if (options) GlobalOption.extend(options)

    registerDirective()

    Vue.component('Photoswipe', PhotoswipeComponent)

    Object.defineProperty(Vue.prototype, '$Pswp', {
        get() {
            return CurrentPswp.get()
        },
    })
}

export const Photoswipe = PhotoswipeComponent
export default install


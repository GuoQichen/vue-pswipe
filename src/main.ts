import { PluginFunction } from 'vue' // eslint-disable-line
import { PswpOptions, ManualCreateArgs } from '@/type'
import { GlobalOption } from '@/config'
import { CurrentPswp, registerDirective, manualCreate, UI } from '@/utils'
import PhotoswipeComponent from '@/components/photoswipe.vue'

const install: PluginFunction<PswpOptions> = (Vue, options?: PswpOptions) => {
    if (options) GlobalOption.extend(options)

    registerDirective()

    Vue.component('Photoswipe', PhotoswipeComponent)

    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$Pswp = {
        open(args: ManualCreateArgs) {
            UI.append()
            manualCreate(args)
        },
        current: CurrentPswp.get(),

    }
}

export const Photoswipe = PhotoswipeComponent
export default install


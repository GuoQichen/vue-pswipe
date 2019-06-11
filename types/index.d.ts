import Vue, { PluginObject } from 'vue'
import { PswpItem, PswpOptions, PswpDirectiveOptions } from '@/type'

declare const VuePswipe: PluginObject<PswpOptions>

export {
    PswpItem,
    PswpOptions,
    PswpDirectiveOptions,
}

export default VuePswipe

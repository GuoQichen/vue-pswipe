import Vue, { PluginObject } from 'vue'
import { PswpItem, PswpOptions, PswpDirectiveOptions } from '../src/type'

declare const VuePswipe: PluginObject<PswpOptions>

export {
    PswpItem,
    PswpOptions,
    PswpDirectiveOptions,
}

export default VuePswipe

import Vue, { PluginFunction } from 'vue'
import Photoswipe from '@/components/photoswipe.vue'
import { PswpItem, PswpOptions, PswpDirectiveOptions } from '../src/type'

declare const VuePswipe: PluginFunction<PswpOptions>

export {
    PswpItem,
    PswpOptions,
    PswpDirectiveOptions,
    Photoswipe,
}

export default VuePswipe

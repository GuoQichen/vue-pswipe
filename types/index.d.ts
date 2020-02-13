import Vue, { PluginFunction } from 'vue'
import Photoswipe from '@/components/photoswipe.vue'
import { PswpItem, PswpOptions, PswpDirectiveOptions } from '../src/type'
import './vue.d'

declare const VuePswipe: PluginFunction<PswpOptions>

export {
    PswpItem,
    PswpOptions,
    PswpDirectiveOptions,
    Photoswipe,
}

export default VuePswipe

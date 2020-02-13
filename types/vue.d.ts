/**
 * Augment the typings of Vue.js
 */

import Vue from 'vue'
import { Pswp, ManualCreateArgs } from '../src/type'

interface $Pswp {
    open: (args: ManualCreateArgs) => Pswp,
    current: Pswp
}

declare module 'vue/types/vue' {
  interface Vue {
    $Pswp: $Pswp
  }
}

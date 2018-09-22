import { Options } from './type/index.d'
import { isMobile, appendOnce } from './utils'
import Pswp from './components/pswp.vue'

export const defualtGlobalOption: Options = {
    // in spa no need history mode
    history: false,
    shareEl: !isMobile(),
    shareButtons: [
        {
            id: 'download', label: 'Download image', url: '{{raw_image_url}}', download: true,
        },
    ],
}

export const getGlobalMixin = (pswp: Pswp, options?: Options) => ({
    data() {
        return {
            globalOptions: options,
        }
    },
    created() {
        // @ts-ignore
        this.pswpElement = appendOnce(pswp.$el)
    },
})


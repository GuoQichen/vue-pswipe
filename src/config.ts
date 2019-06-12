import { PswpOptions } from '@/type'
import { isMobile, appendOnce } from './utils'
import Pswp from './components/pswp.vue'

export const customEvents: string[] = ['beforeOpen']

export const defualtGlobalOption: PswpOptions = {
    // in spa no need history mode
    history: false,
    shareEl: !isMobile(),
    shareButtons: [
        {
            id: 'download', label: 'Download image', url: '{{raw_image_url}}', download: true,
        },
    ],
}

export const getGlobalMixin = (pswp: Pswp, options?: PswpOptions) => ({
    data() {
        return {
            globalOptions: options,
        }
    },
    created(this: any) {
        this.pswpElement = appendOnce(pswp.$el)
    },
})


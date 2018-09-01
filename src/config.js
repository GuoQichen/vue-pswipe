import {
    isMobile,
    appendOnce,
} from './utils'

export const defualtGlobalOption = {
    // in spa no need history mode
    history: false,
    shareEl: !isMobile(),
    shareButtons: [
        {
            id: 'download', label: 'Download image', url: '{{raw_image_url}}', download: true,
        },
    ],
}

export const getGlobalMixin = (pswp, options) => ({
    data() {
        return {
            globalOptions: options,
        }
    },
    created() {
        this.pswpElement = appendOnce(pswp.$el)
    },
})


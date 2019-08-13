import { PswpOptions } from '@/type'
import { isMobile } from '@/utils'

export const customEvents: string[] = ['beforeOpen', 'opened']

const _isMobile = isMobile()
export const defualtGlobalOption: PswpOptions = {
    // in spa no need history mode
    history: false,
    zoomEl: !_isMobile,
    shareEl: !_isMobile,
    shareButtons: [
        {
            id: 'download', label: 'Download image', url: '{{raw_image_url}}', download: true,
        },
    ],
}

export namespace GlobalOption {
    const _options: PswpOptions = defualtGlobalOption
    export const get = () => _options
    export const extend = (...partials: Partial<PswpOptions>[]) => {
        Object.assign(_options, ...partials)
    }
}

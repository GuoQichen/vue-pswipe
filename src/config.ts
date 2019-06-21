import { PswpOptions } from '@/type'
import { isMobile } from '@/utils'

export const customEvents: string[] = ['beforeOpen', 'opened']

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

export namespace GlobalOption {
    let _options: PswpOptions = defualtGlobalOption
    export const get = () => _options
    export const set = (value: PswpOptions) => {
        _options = value
    }
    export const extend = (...partials: Partial<PswpOptions>[]) => {
        Object.assign(_options, ...partials)
    }
}

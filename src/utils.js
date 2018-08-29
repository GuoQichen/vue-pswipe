export const isObject = _ => Object.prototype.toString.call(_) === '[object Object]'

export const errorHanlde = (hint) => {
    throw new Error(
        `[vue-pswipe] ${hint}`,
    )
}

/* eslint-disable consistent-return */
export const getImageSize = path => new Promise((resolve) => {
    const img = new Image()
    let timer
    img.src = path
    img.addEventListener('error', () => {
        clearTimeout(timer)
    })
    const check = () => {
        if (img.width > 0 || img.height > 0) {
            return resolve({
                src: path,
                w: img.width,
                h: img.height,
            })
        }
        timer = setTimeout(check, 40)
    }
    check()
})

export const setOptions = (origin, addition) => {
    if (!isObject(addition)) return
    Object.assign(origin, addition)
}


export const findIndex = (array, fn) => {
    let index = -1
    array.some((item, idx) => {
        const result = fn(item, idx)
        if (result) index = idx
        return result
    })
    return index
}

/**
 * parse picture index and gallery index from URL (#&pid=1&gid=2)
 */
export const parseHash = () => {
    const hash = window.location.hash.substring(1)
    const params = {}

    if (hash.length < 5) return params

    hash.split('&').reduce((acc, cur) => {
        if (!cur) return acc
        const pair = cur.split('=')
        if (pair.length < 2) return acc
        const [key, value] = pair
        acc[key] = value
        return acc
    }, params)

    if (params.gid) params.gid = parseInt(params.gid, 10)

    return params
}

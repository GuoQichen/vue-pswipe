export const isObject = value => Object.prototype.toString.call(value) === '[object Object]'

const isDef = value => (value !== undefined) && (value !== null)

export const isImg = el => el.tagName === 'IMG'

export const errorHandler = (hint) => {
    throw new Error(
        `[vue-pswipe] ${hint}`,
    )
}


export const getImageSize = path => new Promise((resolve) => {
    const img = new Image()
    let timer
    img.src = path
    img.addEventListener('error', () => {
        clearTimeout(timer)
    })
    const check = () => { // eslint-disable-line
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

export const querySelectorList = (selector, context = document) =>
    [...context.querySelectorAll(selector)]

// find nearest parent element
export const closest = (el, fn) =>
    el &&
    el.nodeType === 1 &&
    (fn(el) ? el : closest(el.parentNode, fn))

export const get = (context, path, defaultValue) => {
    try {
        const result = path.split('.').reduce((acc, cur) => acc[cur], context)
        return isDef(result)
            ? result
            : defaultValue
    } catch (err) {
        return defaultValue
    }
}


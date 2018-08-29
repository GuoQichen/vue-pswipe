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

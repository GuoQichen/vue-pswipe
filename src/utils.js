import isString from 'lodash/isString'

export const errorHanlde = (hint) => {
    throw new Error(
        `[vue-pswipe] ${hint}`,
    )
}

/* eslint-disable import/prefer-default-export */
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

export const getImagePath = imageItem =>
    (isString(imageItem)
        ? imageItem
        : imageItem.src)

const path = require('path')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config')

module.exports = merge(webpackBaseConfig, {
    mode: 'production',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        library: 'PhotoSwipe',
    },
})

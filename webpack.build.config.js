const path = require('path')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const plugins = []
if (process.env.ANALYSIS) {
    plugins.push(
        new BundleAnalyzerPlugin(),
    )
}

module.exports = merge(webpackBaseConfig, {
    mode: 'production',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        library: 'Photoswipe',
    },
    plugins,
})

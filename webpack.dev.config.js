const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackBaseConfig = require('./webpack.base.config')

module.exports = merge(webpackBaseConfig, {
    entry: './example/index.js',
    mode: 'development',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'example'),
    },
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js',
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './example/template.html'),
        }),
    ],
})

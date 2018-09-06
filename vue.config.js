module.exports = {
    chainWebpack: (config) => {
        config.module
            .rule('svg')
            .use('file-loader')
            .clear()
            .loader('url-loader')
            .options({
                limit: 5 * 1024,
                name: 'img/[name].[hash:8].[ext]',
            })
    },
    css: {
        extract: false,
    },
    lintOnSave: false,
}

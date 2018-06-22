const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: 'url-loader',
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
    ],

}

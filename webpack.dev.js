const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    devtool: "cheap-module-eval-source-map",

    devServer: {
        contentBase: path.join(process.cwd(), 'public'),
        port: 9000,
        historyApiFallback: {
            disableDotRule: true,
        },
    },
});


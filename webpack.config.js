const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const lessToJs = require('less-vars-to-js');
const variableOverrides = lessToJs(fs.readFileSync(path.resolve(process.cwd(), "src/antd-overrides.less"), "utf8"));
// TODO: override font cdn

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(process.cwd(), 'dist')
    },

    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            babelrc: false,
                            presets: [ ["env", {"modules": false}] ],
                            plugins: [ ["import", {libraryName: "antd", style: true}] ]
                        }

                    },
                    'awesome-typescript-loader'
                ]
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },

            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "less-loader",
                        options: {
                            modifyVars: variableOverrides
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false
        }),
        new CaseSensitivePathsPlugin(),
    ],

    devServer: {
        contentBase: path.join(process.cwd(), 'public'),
        port: 9000
    }
};

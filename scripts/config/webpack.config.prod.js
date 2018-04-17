const resolveApp = require('./common');
const file_list = require('../../public/file-list');
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const shouldUseSourceMap = false;

const config = {
    // Don't attempt to continue if there are any errors.
    bail: true,
    devtool: shouldUseSourceMap,
    entry: file_list,
    output: {
        path: resolveApp('public/dist'),
        filename: '[name].dll.min.js',
        library: '[name]_min_library'//当前情况下将生成，`window.vendor_library`
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: [
                    /public\\src/
                ],
                //exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
                loader: 'babel-loader',
                options: {
                  // @remove-on-eject-begin
                  babelrc: false,
                  presets: [require.resolve('babel-preset-react-app')],
                  // @remove-on-eject-end
                  compact: true,
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true //css压缩
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpg|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1,
                        name: 'img/[name].[hash:7].[ext]'
                    }
                }]
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true //css压缩
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                minimize: true //css压缩
                            }
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }), 
        new ExtractTextPlugin("[name].css"),
        // Minify the code.
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                // Disabled because of an issue with Uglify breaking seemingly valid code:
                // https://github.com/facebookincubator/create-react-app/issues/2376
                // Pending further investigation:
                // https://github.com/mishoo/UglifyJS2/issues/2011
                comparisons: false,
            },
            mangle: {
                safari10: true,
            },
            output: {
                comments: false,
                // Turned on because emoji and regex is not minified properly using default
                // https://github.com/facebookincubator/create-react-app/issues/2488
                ascii_only: true,
            },
            sourceMap: shouldUseSourceMap,
        }),
        new webpack.DllPlugin({ // 这段配置会在 dist 目录生成一个 vendor-manifest.json 文件。
            path: path.join(resolveApp('public/dist'), '[name]-manifest.json'), // 各模块的索引文件，提供给DllReferencePlugin读取
            name: '[name]_min_library' // 所有的内容会存放在这个参数指定的变量下，这个参数跟 output.library保持一致
        })
    ],
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    }
};

module.exports = config;
var webpack = require( 'webpack' )
var path = require( 'path' )
var debug = process.env.NODE_ENV !== "production"
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    target: 'web',
    context: __dirname,
    devtool: "inline-sourcemap",
    entry: [
        './react/app.js'
    ],
    externals: {
        jsdom: 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': 'window'
    },
    output: {
        path: './app/scripts',
        filename: 'react-app.js'
    },
    node: {
        fs: "empty"
    },
    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                loaders: ['eslint'],
                exclude: [
                    path.resolve( __dirname, 'node_modules' ),
                    path.resolve( __dirname, 'react/translations' )
                ]
            }
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: [path.resolve( __dirname, 'node_modules' )]
            }, {
                test: /sinon\.js$/,
                loader: "imports?define=>false"
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }, {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            }, {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
            }
        ]
    },
    resolve: {
        extensions: [ '', '.js', '.jsx' ]
    },
    plugins: debug
        ? [
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify( "development" )
                },
                ENVIRONMENT: JSON.stringify('local_test')
            }),
            new ExtractTextPlugin('bundle.css')
        ]
        : [
            new webpack.optimize.DedupePlugin( ),
            new webpack.optimize.OccurenceOrderPlugin( ),
            new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify( "production" )
                },
                ENVIRONMENT: JSON.stringify('production')
            }),
            new ExtractTextPlugin('bundle.css')
        ]
}

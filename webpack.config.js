var webpack = require( 'webpack' );
var path = require( 'path' );
var debug = process.env.NODE_ENV !== "production";

module.exports = {
    target: 'web',
    context: __dirname,
    devtool: "inline-sourcemap",
    entry: './react/app.js',
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
                exclude: [path.resolve( __dirname, 'node_modules' )],
                query: {
                    presets: [ 'es2015', 'react', 'stage-0' ]
                }
            }, {
                test: /sinon\.js$/,
                loader: "imports?define=>false"
            }
        ]
    },
    resolve: {
        extensions: [ '', '.js', '.jsx' ]
    },
    plugins: debug
        ? [new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify( "development" )
                }
            })]
        : [
            new webpack.optimize.DedupePlugin( ),
            new webpack.optimize.OccurenceOrderPlugin( ),
            new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify( "production" )
                }
            })
        ]
}

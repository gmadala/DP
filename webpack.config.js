var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: __dirname,
    devtool: debug ? "inline-sourcemap" : null,
    entry: './react/app.js',
    output: {
        path: './app/scripts',
        filename: 'react-app.js',
    },    
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, "react"),
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ],
        resolve: {
            extensions: ['', '.js', '.jsx']
        },
    },
    plugins: debug ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false})
    ],
}
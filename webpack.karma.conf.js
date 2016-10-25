const webpackConfig = require('./webpack.config.js');
const argv = require('minimist')(process.argv.slice(2));
webpackConfig.module.loaders.push({
  test: /\.json$/,
  loader: 'json-loader'
});

module.exports = function( config ) {
  config.set( {
    browsers: [ 'Chrome' ],
    frameworks: [ 'mocha' ],
    reporters: [ 'coverage' ],
    files: [
      {
        pattern: 'webpack.testsbundle.js',
        watched: false,
        served: true,
        included: true,
      },
    ],
    preprocessors: {
      'webpack.testsbundle.js': [ 'webpack', 'sourcemap' ],
    },
    plugins: [
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-coverage'
    ],
    autoWatch: false,
    singleRun: true,
    colors: true,
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true,
    },
    client: {
      chai: {
          includeStack: true
      }
    },
  } );
};

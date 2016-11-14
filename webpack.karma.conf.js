const path = require( 'path' );
const webpackConfig = require( './webpack.config.js' );
const argv = require( 'minimist' )( process.argv.slice( 2 ) );
webpackConfig.module.loaders.push( {
  test: /\.json$/,
  loader: 'json-loader'
} );
// webpackConfig.module.preLoaders = [
//   { //delays coverage til after tests are run, fixing transpiled source coverage error
//     test: /\.js$/,
//     include: path.resolve( 'react/app/' ),
//     loader: 'isparta'
//   }
// ];
webpackConfig.module.postLoaders = [ { //delays coverage til after tests are run, fixing transpiled source coverage error
  test: /\.js$/,
  include: path.resolve( 'react/app/' ),
  loader: 'istanbul-instrumenter'
} ];
webpackConfig.entry = '';
webpackConfig.devtool = 'inline-source-map',

  module.exports = function( config ) {
    config.set( {
      frameworks: [
        'mocha', 'sinon', 'chai'
      ],
      reporters: [
        'mocha', 'coverage'
      ],
      files: [ 'webpack.testsbundle.js' ],
      preprocessors: {
        'webpack.testsbundle.js': [ 'webpack', 'sourcemap' ]
      },
      plugins: [
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-phantomjs-launcher',
        'karma-ie-launcher',
        'karma-mocha',
        'karma-sourcemap-loader',
        'karma-webpack',
        'karma-coverage',
        'karma-htmlfile-reporter',
        'karma-mocha-reporter',
        'karma-sinon',
        'karma-chai'
      ],
      autoWatch: false,
      singleRun: true,
      colors: true,
      webpack: webpackConfig,
      webpackServer: {
        noInfo: true
      },
      webpackMiddleware: {
        noInfo: true //please don't spam the console when running in karma!
      },
      htmlReporter: {
        outputFile: 'test/units.html'
      },
      coverageReporter: {
        type: 'html',
        dir: 'test/coverage'
      },
      client: {
        chai: {
          includeStack: true
        }
      }
    } );
  };

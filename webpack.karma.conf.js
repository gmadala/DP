const path = require( 'path' );
const webpackConfig = require( './webpack.config.js' );
const argv = require( 'minimist' )(process.argv.slice( 2 ));
webpackConfig.module.loaders.push({ test: /\.json$/, loader: 'json-loader' });
webpackConfig.module.preLoaders = [
  {
    test: /\.js$/,
    loader: 'isparta',
    include: path.join( __dirname, 'react/app' )
  }
]
webpackConfig.entry = '';
webpackConfig.devtool = 'inline-source-map',

module.exports = function( config ) {
  config.set({
    browsers: [
      'PhantomJS', 'Chrome', 'IE'
    ],
    frameworks: [
      'mocha', 'sinon-chai'
    ],
    reporters: [
      'mocha', 'coverage'
    ],
    files: ['webpack.testsbundle.js'],
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
      'karma-sinon-chai',
      'karma-mocha-reporter'
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
      dir: 'test/coverage',
      instrumenters: {
        isparta: require( 'isparta' )
      },
      instrumenter: {
        '**/*.js': 'isparta'
      }
    },
    client: {
      chai: {
        includeStack: true
      }
    }
  });
};

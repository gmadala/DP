const webpackConfig = require( './webpack.config.js' );
const argv = require( 'minimist' )(process.argv.slice( 2 ));
webpackConfig.module.loaders.push({ test: /\.json$/, loader: 'json-loader' });
webpackConfig.entry = '';

module.exports = function( config ) {
  config.set({
    browsers: [
      'PhantomJS', 'Chrome', 'IE'
    ],
    frameworks: [
      'mocha', 'sinon-chai'
    ],
    reporters: [
      'progress', 'html', 'coverage'
    ],
    files: [
      'react/app/**/*.js', {
        pattern: 'webpack.testsbundle.js',
        watched: false,
        served: true,
        included: true
      }
    ],
    preprocessors: {
      'webpack.testsbundle.js': [
        'webpack', 'sourcemap'
      ],
      'react/app/**/*.js': [ 'webpack', 'coverage' ]
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
      'karma-sinon-chai'
    ],
    autoWatch: false,
    singleRun: true,
    colors: true,
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
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
  });
};

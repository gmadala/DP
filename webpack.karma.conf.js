const webpackConfig = require('./webpack.config.js');
const argv = require('minimist')(process.argv.slice(2));
webpackConfig.module.loaders.push({
  test: /\.json$/,
  loader: 'json-loader'
});
webpackConfig.module.loaders.push({
  test: /sinon(\\|\/)pkg(\\|\/)sinon\.js/,
  loader: 'imports?define=>false,require=>false',
});
webpackConfig.module.loaders.push({
  test: /sinon(\\|\/)pkg(\\|\/)sinon\.js/,
  loader: 'imports?define=>false,require=>false',
});
webpackConfig.resolve = {
  alias: {
      // required for enzyme to work properly
      sinon: 'sinon/pkg/sinon',
  }
};

module.exports = function( config ) {
  config.set( {
    browsers: [ 'PhantomJS', 'Chrome' ],
    frameworks: [ 'mocha', 'sinon-chai' ],
    reporters: [ 'coverage', 'mocha' ],
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
      },
      mocha: {
          reporter: 'html',
          ui: 'bdd'
      }
    },
  } );
};

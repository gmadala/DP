// Karma configuration
module.exports = function (karma) {
  karma.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    frameworks: ['jasmine'],

    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-ng-html2js-preprocessor',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-script-launcher',
      'karma-junit-reporter'
    ],

		// list of files / patterns to load in the browser
		files: [
      'app/components/jquery/dist/jquery.js',
      'app/components/angular/angular.js',
      'app/components/angular-sanitize/angular-sanitize.js',
      'app/components/angular-mocks/angular-mocks.js',
      'app/components/ui-router/release/angular-ui-router.js',
      'app/components/angular-ui-utils/modules/highlight/highlight.js',
      'app/components/angular-ui-utils/modules/event/event.js',
      'app/components/bootstrap-datepicker/js/bootstrap-datepicker.js',
      'app/private-components/angular-strap.js',
      'app/components/moment/moment.js',
      'app/components/fullcalendar/dist/fullcalendar.js',
      'app/components/angular-ui-calendar/src/calendar.js',
      'app/components/modernizr/modernizr.js',
      'app/components/numeral/numeral.js',
      'app/components/angular-cookies/angular-cookies.js',
      'app/components/angular-local-storage/angular-local-storage.js',
      'app/components/highcharts.com/js/highcharts.src.js',
      'app/private-components/angular-gettext/dist/angular-gettext.js',
      'app/private-components/angular-segmentio/angular-segmentio.js',
      'app/components/ng-file-upload/ng-file-upload.js',
      'app/components/ng-file-upload/ng-file-upload-shim.js',

      // Once ui-bootstrap is updated to version 0.6.0 or greater this
      // reference should go back to the minified bower installed version
      'app/private-components/angular-bootstrap/ui-bootstrap-tpls.js',

      'app/components/sinon/lib/sinon/util/fake_timers.js',
      'app/components/lodash/lodash.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'app/scripts/directives/**/*.html',
      'test/spec/**/*.js',
      'test/util/analytics.js',
      'test/util/url-parser.js',
      'test/util/disable-otherwise.js'
    ],

    preprocessors: {
      'app/scripts/directives/**/*.html': 'html2js',
      'app/scripts/**/*.js': 'coverage'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/'
    },

    // list of files to exclude
    exclude: [
      'app/scripts/dev/**/*.js',
      'app/scripts/debug-info.js'
    ],

    // test results reporter to use
    // possible values: dots || progress || growl
    reporters: ['dots', 'coverage', 'junit'],

    coverageReporter: {
      type: 'html',
      dir: 'test/coverage/',
      subdir: '.'
    },

    junitReporter: {
      outputFile: 'target/surefire-reports/client-test-results.xml'
    },

    // web server port
    port: 9876,

    // cli runner port
    runnerPort: 9100,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: karma.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};

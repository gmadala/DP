// Karma configuration
module.exports = function(karma) {
	karma.set({

		// base path, that will be used to resolve files and exclude
		basePath: 'app',

		frameworks: ['jasmine'],

		plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-ng-html2js-preprocessor',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-script-launcher'
		],

		// list of files / patterns to load in the browser
		files: [
		  'components/angular/angular.js',
		  'components/angular-mocks/angular-mocks.js',
			'components/angular-strap/dist/angular-strap.js',
			'components/ui-router/release/angular-ui-router.js',
			'components/angular-bootstrap/ui-bootstrap-tpls.min.js',
		  'scripts/*.js',
		  'scripts/**/*.js',
		  '../test/spec/**/*.js'
		],

		preprocessors: {
			'**/*.html': 'html2js',
			'scripts/**/*.js': 'coverage'
		},

		// list of files to exclude
		exclude: [],

		// test results reporter to use
		// possible values: dots || progress || growl
		reporters: ['dots', 'coverage'],

		coverageReporter: {
			type: 'html',
			dir: '../test/coverage/'
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
		captureTimeout: 5000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false
	});
};

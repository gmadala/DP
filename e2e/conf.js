//An example configuration file.

var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter'),
  jasmineReporters = require('jasmine-reporters'),
  selenium = null;

if (process.env.bamboo_buildNumber) {
  selenium = 'http://selenium-grid.nextgearcapital.com:4444/wd/hub';
}


exports.config = {
  seleniumAddress: selenium,
  baseUrl: 'https://test.nextgearcapital.com/test/#/',
  //Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': [
        '--disable-extensions',
        '-–allow-file-access-from-files',
        '--disable-web-security',
        '--no-sandbox',
        '--test-type=browser'
      ],
      'prefs': {
        'download': {
          'prompt_for_download': false,
          'directory_upgrade': true,
          'default_directory': '/tmp'
        }
      }
    },
    shardTestFiles: true,
    maxInstances: 1
  },

  //Spec patterns are relative to the current working directly when protractor is called.
  specs: ['tests/e2e_spec/e2e_resources_spec.js'],

  //More miscellaneous configuration options
  directConnect: false,
  untrackOutstandingTimeouts: false,
  restartBrowserBetweenTests: false,

  //Framework selection
  framework: 'jasmine2',
  onPrepare: function () {
    require('jasmine-reporters');
    require('protractor-linkuisref-locator')(protractor);
    console.log(new Date().toISOString());

    jasmine.getEnv().clearReporters();

    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      consolidateAll: false,
      savePath: 'target/jasmine-results'
    }));


    jasmine.getEnv().addReporter(
      new HtmlScreenshotReporter({
        dest: 'target/screenshots',
        showSummary: true,
        ignoreSkippedSpecs: true,
        preserveDirectory: false,
        captureOnlyFailedSpecs: true,
        reportOnlyFailedSpecs: true,
        showConfiguration: true,
        pathBuilder: function (currentSpec) {
          return currentSpec.fullName;
        },
        filename: new Date().toISOString().replace(/T/, '-').replace(/[:\\]/g, '').replace(/\..+/, '') + '-test-report.html'
      }))
    ;


    var SpecReporter = require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new SpecReporter({
        displayStacktrace: true,
        colors: {
          success: 'green',
          failure: 'red',
          pending: 'yellow'
        },
        prefixes: {
          success: 'Pass - ',
          failure: 'Fail - ',
          pending: 'Pending - '
        }
      })
    );

  },

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    isVerbose: true,
    includeStackTrace: true,
    showColors: true,
    defaultTimeoutInterval: 60000,
    realtimeFailure: true
  },

  //Project global parameters
  params: {
    userNameDealer: '57694AC',
    userNameAuction: '10298KB',
    userName: '62434AM',
    password: 'ngcpass!0',
    delay: '500',
    shortDelay: '1000',
    mediumDelay: '3000',
    longDelay: '5000',
    longerDelay: '10000'
  }

};

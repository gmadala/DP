//An example configuration file.

var ScreenShotReporter = require('protractor-screenshot-reporter'),
  jasmineReporters = require('jasmine-reporters');


exports.config = {
  seleniumAddress: null,
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
    shardTestFiles: (process.env.maxInstances > 1),
    maxInstances: process.env.maxInstances
  },

  //Spec patterns are relative to the current working directly when protractor is called.
  specs: ['tests/e2e_spec/*_spec.js'],

  //More miscellaneous configuration options
  directConnect: false,
  untrackOutstandingTimeouts: false,

  //Framework selection
  framework: 'jasmine',

  onPrepare: function () {
    require('jasmine-reporters');
    require('protractor-linkuisref-locator')(protractor);
    console.log(new Date().toISOString());

    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      consolidateAll: false,
      savePath: 'target/jasmine-results'
    }));


    jasmine.getEnv().addReporter(new ScreenShotReporter({
      baseDirectory: 'target/screenshots',
      takeScreenShotsOnlyForFailedSpecs: true
    }));

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

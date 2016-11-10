//An example configuration file.
exports.config = {
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
  //specs: ['tests/e2e_spec/*_spec.js'],
  specs: ['tests/e2e_spec/e2e_bank_accounts_spec.js'],

  //More miscellaneous configuration options
  directConnect: true,
  untrackOutstandingTimeouts: false,
  restartBrowserBetweenTests: false,

  //Framework selection
  framework: 'jasmine2',
  onPrepare: function () {
    var env = jasmine.getEnv();
    env.clearReporters();

    var reporters = require('jasmine-reporters');
    var junitReporter = new reporters.JUnitXmlReporter({
      savePath: './test/protractor',
      filePrefix: 'junit-',
      consolidateAll: false
    });
    env.addReporter(junitReporter);

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

    var SpecReporter = require('jasmine-spec-reporter');
    env.addReporter(new SpecReporter({
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
    userNameBankAccount: '3boysmotors',
    userName: '62434AM',
    password: 'ngcpass!0',
    delay: '500',
    shortDelay: '1000',
    mediumDelay: '3000',
    longDelay: '5000',
    longerDelay: '10000'
  }

};

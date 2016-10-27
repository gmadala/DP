//An example configuration file.
exports.config = {
  seleniumAddress: 'http://selenium-grid.nextgearcapital.com:4444/wd/hub',
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
  //specs: ['tests/e2e_spec/e2e_profile_settings_spec.js'],

  //More miscellaneous configuration options
  directConnect: false,
  untrackOutstandingTimeouts: false,
  restartBrowserBetweenTests: false,

  //Framework selection
  framework: 'jasmine',

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

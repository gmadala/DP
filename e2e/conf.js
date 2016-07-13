// An example configuration file.
exports.config = {
  directConnect: true,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': [
        '--disable-extensions',
        '-–allow-file-access-from-files',
        //'--incognito',
        '--disable-web-security'
      ]
    }
  },

  framework: 'jasmine',

  // Spec patterns are relative to the current working directly when protractor is called.
  specs: ['tests/login/*_spec.js'],
  //specs: ['tests/login/e2e_resources_spec.js'],

  // untrackOutstandingTimeouts: true,
  restartBrowserBetweenTests: false,

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    isVerbose: true,
    includeStackTrace: true,
    showColors: true,
    defaultTimeoutInterval: 30000,
    realtimeFailure: true
  },
  params: {
    userNameDealer: '53190md',
    userNameAuction: 'tmsauction',
    userName: '97421EH',
    password: 'ngcpass!0',
    shortDelay: '1000',
    mediumDelay: '3000',
    longDelay: '5000',
    longerDelay: '10000'
  }
};

//An example configuration file.
exports.config = {
  //Capabilities to be passed to the webdriver instance.
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

  //Spec patterns are relative to the current working directly when protractor is called.
  //specs: ['tests/login/*_spec.js'],
  specs: ['tests/login/e2e_login_spec.js'],

  //More miscellaneous configuration options
  directConnect: true,
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

// An example configuration file.
exports.config = {
  directConnect: true,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
    //incognito mode
    //'browserName': 'chrome', 'chromeOptions': { 'args': ['incognito'] }
  },
  framework: 'jasmine2',

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['tests/login/MNGW-Login.js'],
  // untrackOutstandingTimeouts: true,
  restartBrowserBetweenTests: true,

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    isVerbose: true,
    includeStackTrace: true,
    showColors: true,
    defaultTimeoutInterval: 30000,
    realtimeFailure: true
  }

};

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
  //specs: ['tests/login/e2e_login_recover_spec.js', 'tests/login/e2e_resources_spec.js', 'tests/login/e2e_credit_increase_request_spec.js'],
  //specs: ['tests/login/*_spec.js'],
  specs: ['tests/login/e2e_credit_increase_request_spec.js'],
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
    userName: '97421EH',
    userName2: '36017RDT',
    password: 'ngcpass!0',
    shortDelay: '1000',
    mediumDelay: '3000',
    longDelay: '5000'
  }
};

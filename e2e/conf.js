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
  baseUrl: 'https://test.nextgearcapital.com/test/#/login',
  // Spec patterns are relative to the current working directly when
  // protractor is called.
  //specs: ['tests/login/login-recover-suite.js','tests/login/credit-increase-request.js','tests/login/resources-suite.js'],
  specs: ['tests/login/new_login-recover-suite.js'],
  //specs: ['tests/login/resources-suite.js'],
  // untrackOutstandingTimeouts: true,
  restartBrowserBetweenTests: true,

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    isVerbose: true,
    includeStackTrace: true,
    showColors: true,
    defaultTimeoutInterval: 30000,
    realtimeFailure: true
  },
  params: {
    userName:'97421EH',
    userName2:'36017RDT',
    password:'ngcpass!0',
    shortDelay: '1000',
    mediumDelay:'3000',
    longDelay:'5000'
  }
};

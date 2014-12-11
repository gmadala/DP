exports.config = {
  allScriptsTimeout: 10000,

  specs: [
    'e2e-*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'https://test.discoverdsc.com/eui/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};

'use strict';

var fs = require('fs');
function mkdir(path, root) {

  var dirs = path.split('/'), dir = dirs.shift();
  root = (root || '') + dir + '/';

  try {
    fs.mkdirSync(root);
  }
  catch (e) {
    //dir wasn't made, something went wrong
    if (!fs.statSync(root).isDirectory()) {
      throw new Error(e);
    }
  }

  return !dirs.length || mkdir(dirs.join('/'), root);
}

mkdir('target/surefire-reports/');

exports.config = {
  specs: [
    'tests/{,*/}*_spec.js'
  ],

  // a specific suite can be run with grunt protractor:run --suite=suite_name
  // at least dealer and auction suites are needed
  suites: {
    // suite for the auction
    'auction': 'tests/auction/*spec.js',
    // suites for the dealer
    'dealer': 'tests/dealer/*spec.js',
    'dashboard': 'tests/dealer/*dashboard_spec.js',
    'floorplan': 'tests/dealer/*floorplan_spec.js',
    'payments': 'tests/dealer/*payments_spec.js',
    'receipts': 'tests/dealer/*receipts_spec.js'
  },

  //multiCapabilities: [{
  //  'browserName': 'firefox'
  //}, {
  //  'browserName': 'chrome'
  //}],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': [
        '--disable-extensions',
        '-–allow-file-access-from-files',
        '--incognito',
        '--disable-web-security'
      ]
    }
  },

  // to speed up debugging (only works on Chrome)
  directConnect: true,

  // The params object will be passed directly to the Protractor instance,
  // and can be accessed from your test as browser.params. It is an arbitrary
  // object and can contain anything you may need in your test.
  // This can be changed via the command line as:
  //   --params.login.user 'Joe'
  params: {
    user: '53190md',
    password: 'password@1',
    validVin: '1FADP3L92DL172226',
    invalidVin: '12345678901234567'
  },

  framework: 'jasmine',
  baseUrl: 'http://localhost:9000/',
  allScriptsTimeout: 60000,
  onPrepare: function () {
    require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter(null, true, true, './target/surefire-reports/')
    );
    browser.driver.manage().window().maximize();
    console.log('Starting up protractor ...');
    console.log('The following params are available inside jasmine spec: ');
    for (var property in browser.params) {
      if (browser.params.hasOwnProperty(property)) {
        console.log('* ', property, ': ', browser.params[property]);
      }
    }

  },
  jasmineNodeOpts: {
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 30000
  }
};

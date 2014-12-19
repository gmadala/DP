'use strict';

function mkdir(path, root) {

  var dirs = path.split('/'), dir = dirs.shift(), root = (root||'')+dir+'/';

  try { fs.mkdirSync(root); }
  catch (e) {
    //dir wasn't made, something went wrong
    if(!fs.statSync(root).isDirectory()) throw new Error(e);
  }

  return !dirs.length||mkdir(dirs.join('/'), root);
}

var fs = require('fs');
mkdir('target/surefire-reports/');

exports.config = {
  specs: [
    'tests/*_spec.js'
  ],

  //multiCapabilities: [{
  //  'browserName': 'firefox'
  //}, {
  //  'browserName': 'chrome'
  //}],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {'args': ['--disable-extensions']}
  },

  framework: 'jasmine',
  baseUrl: 'http://localhost:9000/',
  allScriptsTimeout: 200000,
  onPrepare: function() {
    require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter(null, true, true, './target/surefire-reports/')
    );
    browser.driver.manage().window().maximize();
  },
  jasmineNodeOpts: {
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 30000
  }
};

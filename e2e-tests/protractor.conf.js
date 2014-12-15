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

//var seleniumVersion = require('../node_modules/protractor/package.json').webdriverVersions.selenium;

exports.config = {
  //seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-' + seleniumVersion + '.jar',
  allScriptsTimeout: 10000,
  specs: [
    'e2e-*.js'
  ],

  multiCapabilities: [{
    'browserName': 'firefox'
  }, {
    'browserName': 'chrome'
  }],

  framework: 'jasmine',
  baseUrl: 'https://test.discoverdsc.com/eui/',
  allScriptsTimeout: 200000,
  onPrepare: function() {
    require('jasmine-reporters');
    //require('protractor-linkuisref-locator')(protractor);
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter(null, true, true, './target/surefire-reports/')
    );
  },
  jasmineNodeOpts: {
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 600000
  }
};

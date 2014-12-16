
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['DealerPortalLogin.js'],
  browserName: 'chrome',
  onPrepare: function() {
  	browser.driver.manage().window().maximize();
  }
};
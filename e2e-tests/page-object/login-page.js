var LoginPage = function () {

  // locators
  this.username = element(by.model('credentials.username'));
  this.password = element(by.model('credentials.password'));
  this.remember = element(by.model('credentials.remember'));
  this.submit = element(by.buttonText('Log In'));

  this.rememberUsername = element(by.id('rememberUsername'));

  this.openPage = function () {
    browser.get('#/login');
  };

  this.waitPage = function () {
    var username = this.username;
    var password = this.password;
    browser.wait(function () {
      return username.isPresent() && password.isPresent();
    }, 2000);
  };

  // getters and setters
  this.setUsername = function (username) {
    this.username.sendKeys(username);
  };

  this.setPassword = function (password) {
    this.password.sendKeys(password);
  };

  this.setRememberUsername = function (rememberUsername) {
    var shouldClick = (this.getRememberUsername() != rememberUsername);
    if (shouldClick) {
      // Trick to get clicking a checkbox. The chrome-driver have issue with clicking checkbox directly.
      // https://code.google.com/p/selenium/issues/detail?id=2766
      browser.driver.actions().click(this.rememberUsername).perform();
    }
  };

  this.getUsername = function () {
    return this.username.getAttribute('value');
  };

  this.getPassword = function () {
    return this.password.getAttribute('value');
  };

  this.getRememberUsername = function () {
    return this.rememberUsername.isSelected();
  };

  this.getSubmit = function () {
    return this.submit.getText();
  };

  // do-ers
  this.doSubmit = function () {
    this.submit.click();
  };

  this.doLogin = function () {
    this.setUsername('77439IM');
    this.setPassword('password@1');
    this.doSubmit();
  };

  this.doLoginWithError = function () {
    this.setUsername('AtlantaEastDealer1');
    this.setPassword('demouser@1');
    this.doSubmit();
  };

  this.doLoginWithRemember = function () {
    this.setUsername('77439IM');
    this.setPassword('password@1');
    this.setRememberUsername(true);
    this.doSubmit();
  };

};

module.exports = new LoginPage();

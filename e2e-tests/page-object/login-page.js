var LoginPage = function () {

  // locators
  this.username = element(by.model('credentials.username'));
  this.password = element(by.model('credentials.password'));
  this.remember = element(by.model('credentials.remember'));
  this.submit = element(by.buttonText('Log In'));

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

  this.setRemember = function () {
    this.remember.click();
  };

  this.getUsername = function () {
    return this.username.getAttribute('value');
  };

  this.getPassword = function () {
    return this.password.getAttribute('value');
  };

  this.getRemember = function () {
    return this.remember.isSelected();
  };

  this.getSubmit = function () {
    return this.submit.getText();
  };

  // do-ers
  this.doSubmit = function () {
    // return the promise after clicking
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

  };

};

module.exports = new LoginPage();

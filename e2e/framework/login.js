var userName = '53190md';
var password = 'ngcpass!0';
var delay = 200;
var longDelay = 500;
login = {

  elements: {
    //Locators

    forgotUsernamePassword: function () {

      return element(by.id("forgotUsernamePassword"));

    },

    userName: function () {

      return element(by.id("credUsername"));

    },
    signUpLogin: function () {

      return element(by.id("signUpLogin"));

    },
    password: function () {

      return element(by.id("credPassword"));

    },
    loginButton: function () {

      return element(by.id("loginButton"));

    }

  }, //Locator End

  //Clicking
  clickLoginButton: function () {

    return this.elements.loginButton().click();

  },
  clickforgotUsernamePassword: function () {

    this.elements.forgotUsernamePassword().click();
    browser.sleep(delay);

  },
  clicksignUpLogin: function () {

    this.elements.signUpLogin().click();
    //put the waits in the page objects when actions are taken so that it is ready for the test to do what you need it to. It creates cleaner tests too
    browser.sleep(delay);
  },

  //Getting
  getLoginButtonText: function () {


    return this.elements.loginButton().getText();

  },
  textsignUpLogin: function () {


    return this.elements.signUpLogin().getText();

  },
  textforgotUsernamePassword: function () {

    return this.elements.forgotUsernamePassword().getText();

  },

  //Sending
  enterUserName: function () {

    return this.elements.userName().clear().sendKeys(userName);

  },
  enterPassword: function () {

    return this.elements.password().clear().sendKeys(password);

  },
  //Functions
  login: function () {
    this.enterUserName(userName);
    this.enterPassword(password);
    this.clickLoginButton();
  },

  //LAST ONE
  placeholder: function (index) {

    this.elements._thumbnail(index).click();

  }
};

module.exports = login;

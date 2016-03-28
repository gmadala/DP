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
    browser.sleep(delay);

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
  enterUserName: function (test) {

    return this.elements.userName().clear().sendKeys(test);

  },
  enterPassword: function (test) {

    return this.elements.password().clear().sendKeys(test);

  },
  //Functions
  login: function () {
    this.enterUserName(userName);
    this.enterPassword(password);
    this.clickLoginButton();
  },
  login2: function (param1,param2) {
    this.enterUserName(param1);
    this.enterPassword(param2);
    this.clickLoginButton();
  },

  //LAST ONE
  placeholder: function (index) {

    this.elements._thumbnail(index).click();

  }
};

module.exports = login;

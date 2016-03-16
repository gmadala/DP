var validEmailAddress = 'test@gmail.com';
var invalidEmailAddress = 'sad3e2@gmail.com';
var validUserName = '36017RDT';
var invalidEmailFormat = 'sdfsdf';
var correctSecurityAnswer = 'a';
var incorrectSecurityAnswer = 'f';
var delay = 200;

loginRecover = {


  elements: {
    //Locators
    //Password error phone numbers
    passwordErrorPhoneNumbers: function () {

      return element.all(by.css('table.error-table'));

    },
    passwordErrorPhoneNumberText: function () {

      return element(by.css('p[ng-show="passwordRecovery.questionsFailed"]'));

    },
    passwordErrorText: function () {

      return element(by.css('p[ng-show="passwordRecovery.questionsFailed"]'));

    },

    securityQuestion9Text: function () {

      return element.all(by.css('.security-question')).get(2);

    },
    securityQuestion9: function () {

      return element.all(by.id('question9'));

    },
    securityQuestion6Text: function () {

      return element.all(by.css('.security-question')).get(1);

    },
    securityQuestion6: function () {

      return element.all(by.id('question6'));

    },
    securityQuestion10Text: function () {

      return element.all(by.css('.security-question')).get(0);

    },
    securityQuestion10: function () {

      return element.all(by.id('question10'));

    },
    securityQuestion5: function () {

      return element.all(by.id('question3'));

    },
    //What is the name of your favorite childhood friend?
    securityQuestion3: function () {

      return element.all(by.id('question3'));

    },
    incorrectEmailFormat: function () {

      return element(by.css('p[ng-show="forgotUserNameValidity.email.$error.email"]'));

    },

    passwordButton: function () {

      return element(by.id("forgotPasswordSubmit"));

    },
    //THis should be named "userName"
    enterUserNamePassword: function () {

      return element(by.id("userName"));

    },
    userName: function () {

      return browser.element(by.model('passwordRecovery.username'));

    },
    email: function () {

      return element(by.id("email"));

    },
    emailNotFound: function () {

      return element(by.css('p[ng-show="userNameRecovery.failed"]'));

    },
    emailNotFoundNumbers: function () {

      return element.all(by.css('.error-table')).first();

    },
    userNameDisabled: function () {

      return element.all(by.css('input[disabled="disabled"]'));

    },

    submitUsername: function () {

      return element(by.id("forgotUsernameSubmit"));

    }

  }, //Locator End

  //Clicking
  clickPasswordButton: function () {

    this.elements.passwordButton().click();
    browser.sleep(delay);

  },
  clickSubmitButton: function () {

    this.elements.submitUsername().click();
    browser.sleep(delay);
  },

  //Getting
  getPasswordErrorTextPhoneNumber: function () {


    return this.elements.passwordErrorPhoneNumbers().getText();

  },
  getPasswordErrorText: function () {


    return this.elements.passwordErrorText().getText();

  },
  getSecurityQuestion6Text: function () {


    return this.elements.securityQuestion6Text().getText();

  },
  getSecurityQuestion9Text: function () {


    return this.elements.securityQuestion9Text().getText();

  },
  getSecurityQuestion10Text: function () {


    return this.elements.securityQuestion10Text().getText();

  },
  getIncorrectEmailFormat: function () {


    return this.elements.incorrectEmailFormat().getText();

  },
  getemailNotFoundNumbers: function () {


    return this.elements.emailNotFoundNumbers().getText();

  },

  getemailNotFoundText: function () {


    return this.elements.emailNotFound().getText();

  },
  getSubmitButtonText: function () {


    return this.elements.submitUsername().getText();

  },

  //Sending
  enterQuestion9: function () {

    return this.elements.securityQuestion9().clear().sendKeys(correctSecurityAnswer);

  },
  enterIncorrectQuestion9: function () {

    return this.elements.securityQuestion9().sendKeys(incorrectSecurityAnswer);

  },
  enterIncorrectQuestion6: function () {

    return this.elements.securityQuestion6().sendKeys(incorrectSecurityAnswer);

  },
  enterQuestion6: function () {

    return this.elements.securityQuestion6().clear().sendKeys(correctSecurityAnswer);

  },
  enterIncorrectQuestion10: function () {

    return this.elements.securityQuestion10().sendKeys(incorrectSecurityAnswer);

  },
  enterQuestion10: function () {

    return this.elements.securityQuestion10().clear().sendKeys(correctSecurityAnswer);

  },
  enterQuestion5: function () {

    return this.elements.securityQuestion5().sendKeys('a');

  },
  enterQuestion3: function () {

    return this.elements.securityQuestion3().sendKeys('a');

  },
  enterInvalidEmailFormat: function () {

    return this.elements.email().clear().sendKeys(invalidEmailFormat);

  },
  enterValidUserName: function () {

    return this.elements.enterUserNamePassword().clear().sendKeys(validUserName);

  },
  enterEmail: function (param) {

    return this.elements.email().clear().sendKeys(param);
    browser.sleep(delay);
  },
  enterInvalidEmail: function () {

    this.elements.email().sendKeys(invalidEmailAddress);
    browser.sleep(delay);
  },
  //Count
  userNameDisabledCount: function () {

    return this.elements.userNameDisabled().count();

  },
  //LAST ONE
  placeholder: function (index) {

    this.elements._thumbnail(index).click();

  }
};

module.exports = loginRecover;

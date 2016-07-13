'use strict';

var loginObjects = require('../../framework/e2e_login_objects.js');
var recoverErrorMessage = require('../../framework/e2e_login_recover_objects.js');
var login = require('../../framework/e2e_login.js');
var modalObjects = require('../../framework/e2e_modal_objects.js');
var execSettings = require('../../framework/e2e_execSettings.js');
var incorrectAnswer = 'f';
var correctAnswer = 'a';
var validEmail = 'test@gmail.com';
var invalidEmail = 'asdas@gmail.com';
var invalidFormatEmail = 'testtesttest';
var username = '79714js';
var password = 'ngcpass!0';
var longDelay = 6000;
var mediumDelay = 3000;

var loginObjects = new loginObjects.loginObjects();
var modalObjects = new modalObjects.modalObjects();

describe("Login Recovery\n ", function () {

  beforeEach(function () {
    browser.sleep(browser.params.shortDelay);
    browser.driver.manage().window().maximize();
    browser.get(execSettings.loginPage());
    browser.ignoreSynchronization = true;
  });
  afterEach(function () {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  });

  xit("1. Dealer - Sign Up for My Next Gear", function () {
    //Validating the SignUp Button label
    expect(loginObjects.getTextSignUpLogin()).toEqual("Sign Up");
    loginObjects.doSignUpLogin();
    //Validating the Current URL
    expect(browser.getCurrentUrl()).toEqual("http://www.nextgearcapital.com/apply-for-credit/");
    browser.close();
  });

  it("2. Dealer - Forgot User name. My email is correct and no problems", function () {
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
    //Validating the SignUp Button label
    expect(loginObjects.getTextSignUpLogin()).toEqual("Sign Up");
    //Validating the ForgotUsernamePassword Label
    expect(loginObjects.getTextForgotUsernamePassword()).toEqual("Forgot your username or password?");
    loginObjects.doForgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual(execSettings.forgotPage());
    loginObjects.setEmail(validEmail);
    //Validating the Submit Button label
    expect(loginObjects.getTextSubmitUsername()).toEqual("Submit");
    loginObjects.doUsernameSubmit();
    expect(modalObjects.getTextHeader()).toEqual("Success");
    expect(modalObjects.getTextBody()).toEqual("Thank you, check your email for the requested account information.");
    //Clicking OK button on modalObjects Window
    modalObjects.doOKBtn();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });

  it("3. Dealer - Forgot User name. invalid email id no problems ", function () {
    loginObjects.setLogin('53190md', 'incorrect');
    loginObjects.doLogin();
    browser.sleep(longDelay);
    expect(login.getInvalidLoginText1()).toEqual("We're sorry, but you used a username or password that doesn't match our records.");
    expect(login.getInvalidLoginText2()).toEqual('If you are experiencing an issue logging in, click "Forgot your username or password?" below, or contact:');
    loginObjects.doForgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual(execSettings.forgotPage());

    //Enter invalid email id
    loginObjects.setEmail(invalidEmail);

    //Check username box is disabled and submit
    expect(recoverErrorMessage.disabledCount()).toEqual(1);
    expect(element(by.model('passwordRecovery.username')).isEnabled()).toBe(false);
    expect(loginObjects.elPasswordRecoveryModal.isEnabled()).toBe(false);
    expect(loginObjects.getTextSubmitUsername()).toEqual("Submit");
    loginObjects.doUsernameSubmit();

    // //Verify error message text
    // expect(recoverErrorMessage.getemailNotFoundText()).toEqual("We were unable to locate this email address. If you need assistance, please call NextGear Capital Support at:");

    //Enter incorrect email id and submit
    loginObjects.elEmail.clear();
    loginObjects.setEmail(invalidFormatEmail);
    loginObjects.doUsernameSubmit();
    expect(recoverErrorMessage.getIncorrectEmailFormat()).toContain("is not a valid email address. If you need assistance, please call NextGear Capital Support at:");

    //Enter valid email id and submit
    loginObjects.elEmail.clear();
    loginObjects.setEmail(validEmail);
    loginObjects.doUsernameSubmit();

    //Verify Success Modal
    expect(modalObjects.getTextHeader()).toEqual("Success");
    expect(modalObjects.getTextBody()).toEqual("Thank you, check your email for the requested account information.");
    //Exit out and verify back to main
    modalObjects.doOKBtn();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });

  it("4. Dealer - Forgot password and provide answers", function () {
    //Check button text
    loginObjects.doForgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual(execSettings.forgotPage());
    //Enter Username
    loginObjects.elFUPWUsername.sendKeys('36017RDT');
    loginObjects.doSubmitPassword();
    browser.sleep(mediumDelay);
    //Answer Security Questions and validate
    expect(recoverErrorMessage.getSecurityQuestion10Text()).toEqual("What is the name of a college you applied to but didn't attend?");
    expect(recoverErrorMessage.getSecurityQuestion6Text()).toEqual("In what city or town was your first job?");
    expect(recoverErrorMessage.getSecurityQuestion9Text()).toEqual("What is your maternal grandmother's maiden name?");
    //Entering incorrect Answer
    loginObjects.setSecQuestions(incorrectAnswer);
    loginObjects.doSubmitPassword();
    browser.sleep(mediumDelay);
    //Verify Success Modal
    expect(recoverErrorMessage.getPasswordErrorText()).toEqual("We were unable verify one or more of your answers. If you need assistance, please call NextGear Capital Support at:");
    expect(recoverErrorMessage.getPasswordErrorTextPhoneNumber()).toContain("United States 1.888.969.3721");
    expect(recoverErrorMessage.getPasswordErrorTextPhoneNumber()).toContain("Canada - Quebec 1.855.864.9291");
    expect(recoverErrorMessage.getPasswordErrorTextPhoneNumber()).toContain("Canada - National 1.877.864.9291");
    //Entering correct Answer
    loginObjects.setSecQuestions(correctAnswer);
    loginObjects.doSubmitPassword();
    browser.sleep(mediumDelay);
    //Validating Success Modal window
    expect(modalObjects.getTextHeader()).toEqual("Success");
    expect(modalObjects.getTextBody()).toEqual("Thank you, check your email for the requested account information.");
    modalObjects.doOKBtn();
    //Exit out and verify back to main
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });

  it("5. Dealer - Validating the NGC Logo and Language selection in Login Page", function () {
    expect(loginObjects.elMNGLogo.isDisplayed()).toBe(true);
    expect(loginObjects.elLangChooser.isDisplayed()).toBe(true);
    expect(loginObjects.elEnglish.isDisplayed()).toBe(true);
    expect(loginObjects.elSpanish.isDisplayed()).toBe(true);
    expect(loginObjects.elFrench.isDisplayed()).toBe(true);
    //Validating the default language as English
    expect(loginObjects.getTextLogin()).toBe("Log In");
    //Validating the Spanish Language button
    loginObjects.doSpanish();
    expect(loginObjects.getTextLogin()).toBe("Iniciar sesión");
    //Validating the French Language button
    loginObjects.doFrench();
    expect(loginObjects.getTextLogin()).toBe("Ouverture de session");
    //Validating the English language button
    loginObjects.doEnglish();
    expect(loginObjects.getTextLogin()).toBe("Log In");
  });

});

'use strict';

var loginObjects = require('../../framework/login-objects.js');
var recoverErrorMessage = require('../../framework/login-recover-objects.js');
var login = require('../../framework/login.js');
var modal = require('../../framework/modal-objects.js');
var incorrectAnswer = 'f';
var correctAnswer = 'a';
var validEmail = 'test@gmail.com';
var invalidEmail = 'asdas@gmail.com';
var invalidFormatEmail = 'sadsadas';
var loginUrl = "https://test.nextgearcapital.com/test/#/login";
var homeUrl = "https://test.nextgearcapital.com/test/#/home";
var forgotUrl = "https://test.nextgearcapital.com/test/#/login/recover";
var username = '53190md';
var password = 'ngcpass!0';
var delay = browser.sleep(500);

var loginObjects = new loginObjects.loginObjects();

describe("Login as Dealer\n ", function () {

  beforeEach(function () {
    browser.sleep(browser.params.shortDelay);
    browser.driver.manage().window().maximize();
    browser.get(loginUrl);
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
    browser.sleep(3000);
    browser.close();
  });

  it("2. Dealer - Forgot User name. My email is correct and no problems", function () {
    expect(browser.getCurrentUrl()).toEqual(loginUrl);
    //Validating the SignUp Button label
    expect(loginObjects.getTextSignUpLogin()).toEqual("Sign Up");
    //Validating the ForgotUsernamePassword Label
    expect(loginObjects.getTextForgotUsernamePassword()).toEqual("Forgot your username or password?");
    loginObjects.doForgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual(forgotUrl);
    loginObjects.setEmail(validEmail);
    //Validating the Submit Button label
    expect(loginObjects.getTextSubmitUsername()).toEqual("Submit");
    loginObjects.doUsernameSubmit();
    expect(modal.header()).toEqual("Success");
    expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");
    //Clicking OK button on Modal Window
    modal.clickOkButton();
    expect(browser.getCurrentUrl()).toEqual(loginUrl);
  });

  it("3. Dealer - Forgot User name. invalid email id no problems ", function () {
    loginObjects.setLogin('53190md', 'incorrect');
    loginObjects.doLogin();
    expect(login.getInvalidLoginText1()).toEqual("We're sorry, but you used a username or password that doesn't match our records.");
    expect(login.getInvalidLoginText2()).toEqual('If you are experiencing an issue logging in, click "Forgot your username or password?" below, or contact:');
    loginObjects.doForgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual(forgotUrl);

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
    expect(modal.header()).toEqual("Success");
    expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");
    //Exit out and verify back to main
    modal.clickOkButton();
    delay;
    expect(browser.getCurrentUrl()).toEqual(loginUrl);
  });

  it("4. As a dealer I forgot my password. All my answers", function () {
    //Check button text
    loginObjects.doForgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual(forgotUrl);
    //Enter Username
    loginObjects.elFUPWUsername.sendKeys('36017RDT');
    loginObjects.doSubmitPassword();
    delay;
    //Answer Security Questions and validate
    expect(recoverErrorMessage.getSecurityQuestion10Text()).toEqual("What is the name of a college you applied to but didn't attend?");
    expect(recoverErrorMessage.getSecurityQuestion6Text()).toEqual("In what city or town was your first job?");
    expect(recoverErrorMessage.getSecurityQuestion9Text()).toEqual("What is your maternal grandmother's maiden name?");
    //Entering incorrect Answer
    loginObjects.setSecQuestions(incorrectAnswer);
    loginObjects.doSubmitPassword();
    //Verify Success Modal
    expect(recoverErrorMessage.getPasswordErrorText()).toEqual("We were unable verify one or more of your answers. If you need assistance, please call NextGear Capital Support at:");
    expect(recoverErrorMessage.getPasswordErrorTextPhoneNumber()).toContain("United States 1.888.969.3721");
    expect(recoverErrorMessage.getPasswordErrorTextPhoneNumber()).toContain("Canada - Quebec 1.855.864.9291");
    expect(recoverErrorMessage.getPasswordErrorTextPhoneNumber()).toContain("Canada - National 1.877.864.9291");
    //Entering correct Answer
    loginObjects.setSecQuestions(correctAnswer);
    loginObjects.doSubmitPassword();
    //Validating Success Modal window
    expect(modal.header()).toEqual("Success");
    expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");
    modal.clickOkButton();
    //Exit out and verify back to main
    expect(browser.getCurrentUrl()).toEqual(loginUrl);
  });

  it("5. Dealer - Login with Null values", function () {
    loginObjects.setLogin(' ', ' ');
    loginObjects.doLogin();
    expect(browser.getCurrentUrl()).toEqual(loginUrl);
  });

  it("6. Dealer - Login with Incorrect Username and Password", function () {
    loginObjects.setLogin('test', 'test');
    loginObjects.doLogin();
    expect(browser.getCurrentUrl()).toEqual(loginUrl);
  });

  it("7. Dealer - Login with Null Password value", function () {
    loginObjects.setLogin(username, '');
    loginObjects.doLogin();
    expect(browser.getCurrentUrl()).toEqual(loginUrl);
  });

  it("8. Dealer - Login with Null Username value", function () {
    loginObjects.setLogin('', password);
    loginObjects.doLogin();
    expect(browser.getCurrentUrl()).toEqual(loginUrl);
  });

  it("9. Dealer - Good Login", function () {
    loginObjects.doGoodLogin();
    expect(browser.getCurrentUrl()).toEqual(homeUrl);
  });
});

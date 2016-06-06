'use strict';

var loginRecover = require('../../framework/new_login-objects.js');
var login = require('../../framework/login.js');
var modal = require('../../framework/modal-objects.js');
var incorrectAnswer = 'f';
var correctAnswer = 'a';
var validEmail = 'test@gmail.com';
var inValidEmail = 'asdas@gmail.com';
var invalidFormatEmail = 'sadsadas';
var homepageUrl = "https://test.nextgearcapital.com/test/#/login";
var homeUrl = "https://test.nextgearcapital.com/test/#/home";
var forgotUrl = "https://test.nextgearcapital.com/test/#/login/recover";
var username = ' ';
var password = ' ';

var newLogin = new loginRecover.newLogin();

describe("Login as Dealer\n ", function () {
  beforeEach(function () {
    browser.sleep(browser.params.shortDelay);
    browser.driver.manage().window().maximize();
    browser.get(homepageUrl);
    browser.ignoreSynchronization = true;
  });
  afterEach(function () {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  });

  xit("1. New Dealer - Sign Up to My Next Gear", function () {
    //Validating the SignUp Button label
    expect(newLogin.getTextSignUpLogin()).toEqual("Sign Up");
    newLogin.doSignUpLogin();
    //Validating the Current URL
    expect(browser.getCurrentUrl()).toEqual("http://www.nextgearcapital.com/apply-for-credit/");
    browser.sleep(3000);
    browser.close();
  });

  xit("2. Dealer - Forgot User name. My email is correct and no problems", function () {
    //browser.get(homepageUrl);
    expect(browser.getCurrentUrl()).toEqual(homepageUrl);
    //Validating the SignUp Button label
    expect(newLogin.getTextSignUpLogin()).toEqual("Sign Up");
    //Validating the ForgotUsernamePassword Label
    expect(newLogin.getTextForgotUsernamePassword()).toEqual("Forgot your username or password?");
    newLogin.doForgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual(forgotUrl);
    expect(newLogin.elEmail.isDisplayed()).toBe(true);
    newLogin.setEmail(validEmail);
    //Validating the Submit Button label
    expect(newLogin.getTextSubmitUsername()).toEqual("Submit");
    newLogin.doUsernameSubmit();
    expect(modal.header()).toEqual("Success");
    expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");
    //Clicking OK button on Modal Window
    modal.clickOkButton();
    expect(browser.getCurrentUrl()).toEqual(homepageUrl);
  });
  xit("3. Dealer - Good Login", function () {
    // browser.get(homepageUrl);
    newLogin.doClearLogin();
    newLogin.setLogin('53190md', 'ngcpass!0');
    newLogin.doLogin();
    browser.sleep(3000);
    expect(browser.getCurrentUrl()).toEqual(homeUrl);
  });
  xit("4. Dealer - Login with Null values", function () {
    newLogin.doClearLogin();
    newLogin.setLogin('', '');
    newLogin.doLogin();
    expect(browser.getCurrentUrl()).toEqual(homepageUrl);
  });
  xit("5. Dealer - Login with Incorrect Username and Password", function () {
    newLogin.doClearLogin();
    newLogin.setLogin('test', 'test');
    newLogin.doLogin();
    expect(browser.getCurrentUrl()).toEqual(homepageUrl);
  });
  xit("6. Dealer - Login with Null Password value", function () {
    newLogin.doClearLogin();
    newLogin.setLogin('53190md', '');
    newLogin.doLogin();
    expect(browser.getCurrentUrl()).toEqual(homepageUrl);
  });
  xit("7. Dealer - Login with Null Username value", function () {
    newLogin.doClearLogin();
    newLogin.setLogin('', 'ngcpass!0');
    newLogin.doLogin();
    expect(browser.getCurrentUrl()).toEqual(homepageUrl);
  });

  xit("8. Dealer - Login with Incorrect Password", function () {

    newLogin.doClearLogin();
    newLogin.setLogin('53190md', 'incorrect');
    newLogin.doLogin();
    browser.sleep(15000);
    // expect(newLogin.getTextLoginError1()).toEqual("We're sorry, but you used a username or password that doesn't match our records.");
    // expect(newLogin.getTextLoginError2()).toEqual('If you are experiencing an issue logging in, click "Forgot your username or password?" below, or contact:');

  });
  xit("Dealer - Forgot User name. invalid email id no problems ", function () {
    newLogin.setLogin('53190md', 'incorrect');
    browser.sleep(500);
    // expect(newLogin.getTextLoginError1()).toEqual("We're sorry, but you used a username or password that doesn't match our records.");
    // expect(newLogin.getTextLoginError2()).toEqual('If you are experiencing an issue logging in, click "Forgot your username or password?" below, or contact:');
    // expect(login.getInvalidLoginText1()).toEqual("We're sorry, but you used a username or password that doesn't match our records.");
    // expect(login.getInvalidLoginText2()).toEqual('If you are experiencing an issue logging in, click "Forgot your username or password?" below, or contact:');

    //Click to login
    newLogin.doForgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual(forgotUrl);
    //Enter invalid email
    newLogin.setEmail(inValidEmail);
    browser.sleep(5000);
    //loginRecover.enterEmail(invalidEmail);
    //Check username box is disabled and submit
    //expect(loginRecover.disabledCount()).toEqual(1);
    // expect(newLogin.doDisabledCount()).toEqual(1);
    //  expect(element(by.model('passwordRecovery.username')).isEnabled()).toBe(false);
    expect(newLogin.elPasswordRecoveryModal.isEnabled()).toBe(false);
    expect(newLogin.getTextSubmitUsername()).toEqual("Submit");
    newLogin.doUsernameSubmit();

    //Verify error message text
    // expect(loginRecover.getemailNotFoundText()).toEqual("We were unable to locate this email address. If you need assistance, please call NextGear Capital Support at:");
    // expect(loginRecover.getemailNotFoundNumbers()).toContain("United States 1.888.969.3721");
    // expect(loginRecover.getemailNotFoundNumbers()).toContain("Canada - Quebec 1.855.864.9291");
    // expect(loginRecover.getemailNotFoundNumbers()).toContain("Canada - National 1.877.864.9291");

    //Enter incorrect email and submit
    newLogin.elEmail.clear();
    newLogin.setEmail(invalidFormatEmail);
    newLogin.doUsernameSubmit();

    //loginRecover.clickUsernameSubmit();
    //expect(loginRecover.getIncorrectEmailFormat()).toContain("is not a valid email address. If you need assistance, please call NextGear Capital Support at:");

    //Enter correct email and submit
    newLogin.elEmail.clear();
    newLogin.setEmail(validEmail);
    newLogin.doUsernameSubmit();

    //Verify Success Modal
    expect(modal.header()).toEqual("Success");
    expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");
    //Exit out and verify back to main
    modal.clickOkButton();
    expect(browser.getCurrentUrl()).toEqual(homepageUrl);
  });
  it("4. As a dealer I forgot my password. All my answers are correct", function () {
    //Check button text
    newLogin.doForgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual(forgotUrl);
    //Enter Username
    newLogin.elFUPWUsername.sendKeys('36017RDT');
    newLogin.doSubmitPassword();
    //Answer Security Questions and validate
    expect(newLogin.getTextSecuQues10()).toEqual("What is the name of a college you applied to but didn't attend?");
    expect(newLogin.getTextSecuQues6()).toEqual("In what city or town was your first job?");
    expect(newLogin.getTextSecuQues9()).toEqual("What is your maternal grandmother's maiden name?");
    newLogin.setSecQuestions(correctAnswer);
    newLogin.doSubmitPassword();
    browser.sleep(1000);
    //Verify Success Modal
    newLogin.successModalWindow();
    // expect(modal.header()).toEqual("Success");
    // expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");
    // //Exit out and verify back to main
    // modal.clickOkButton();
    expect(browser.getCurrentUrl()).toEqual(homepageUrl);

  });

  xit("5. As a dealer I forgot my password. All my answers are NOT correct", function () {
    newLogin.doForgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual(forgotUrl);
    //Enter Username
    newLogin.elFUPWUsername.sendKeys('36017RDT');
    //Validate email address field is disabled and click
    //expect(loginRecover.disabledCount()).toEqual(1);
    newLogin.doSubmitPassword();
    //Answer Security Questions and validate
    expect(newLogin.getTextSecuQues10()).toEqual("What is the name of a college you applied to but didn't attend?");
    expect(newLogin.getTextSecuQues6()).toEqual("In what city or town was your first job?");
    expect(newLogin.getTextSecuQues9()).toEqual("What is your maternal grandmother's maiden name?");
    newLogin.setSecQuestions(incorrectAnswer);
    browser.sleep(1000);
    newLogin.doSubmitPassword();
    browser.sleep(1000);
    //Verify Success Modal
    // expect(loginRecover.getPasswordErrorText()).toEqual("We were unable verify one or more of your answers. If you need assistance, please call NextGear Capital Support at:");
    // expect(loginRecover.getPasswordErrorTextPhoneNumber()).toContain("United States 1.888.969.3721");
    // expect(loginRecover.getPasswordErrorTextPhoneNumber()).toContain("Canada - Quebec 1.855.864.9291");
    // expect(loginRecover.getPasswordErrorTextPhoneNumber()).toContain("Canada - National 1.877.864.9291");
    //Exit out and verify back to main
    newLogin.setSecQuestions(correctAnswer);
    newLogin.doSubmitPassword();
    browser.sleep(500);
    //Verify Success Modal
    expect(modal.header()).toEqual("Success");
    expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");
    //Exit out and verify back to main
    modal.clickOkButton();
    expect(browser.getCurrentUrl()).toEqual(homepageUrl);
  });
})
;

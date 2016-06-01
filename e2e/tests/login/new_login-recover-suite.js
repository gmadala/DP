'use strict';

var loginRecover = require('../../framework/new_login-objects.js');
var login = require('../../framework/login.js');
var modal = require('../../framework/modal-objects.js');
var incorrectAnswer = 'f';
var correctAnswer = 'a';
var validEmail = 'test@gmail.com';
var invalidEmail = 'asdas@gmail.com';
var invalidFormatEmail = 'sadsadas';
var homepageUrl = "https://test.nextgearcapital.com/test/#/login";
var forgotUrl = "https://test.nextgearcapital.com/test/#/login/recover";

//var login = new login();
var newLogin = new loginRecover.newLogin();

describe("Login as Dealer\n ", function () {

  beforeEach(function () {
    browser.sleep(browser.params.shortDelay);
    browser.driver.manage().window().maximize();
    browser.get(homepageUrl);
    browser.ignoreSynchronization = true;
  });
  xit("1. New Dealer - Sign Up to My Next Gear", function() {
    //Validating the SignUp Button label
    expect(newLogin.getTextSignUpLogin()).toEqual("Sign Up");
    newLogin.doSignUpLogin();
    //Validating the Current URL
    expect(browser.getCurrentUrl()).toEqual("http://www.nextgearcapital.com/apply-for-credit/");
    browser.sleep(3000);
    browser.close();
  });

  it("2. Dealer - Forgot User name. My email is correct and no problems", function () {
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
    // expect(newLogin.getTextSubmitBtn()).toEqual("Submit");
    newLogin.doUsernameSubmit();
    expect(modal.header()).toEqual("Success");
    expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");
    //Clicking OK button on Modal Window
    modal.clickOkButton();
    expect(browser.getCurrentUrl()).toEqual(homepageUrl);
  });

  xit("3. Dealer - Forgot User name. My email is NOT correct and have to reenter email", function () {
    browser.sleep(5000);
    //Login with incorrect password
    expect(newLogin.elUserName.isDisplayed()).toBe(true);
    expect(newLogin.elPassWord.isDisplayed()).toBe(true);

    newLogin.setLogin();
    //newLogin.setLogin('53190md', 'incorrect');
    browser.sleep(15000);
    // expect(login.getInvalidLoginText1()).toEqual("We're sorry, but you used a username or password that doesn't match our records.");
    // expect(login.getInvalidLoginText2()).toEqual('If you are experiencing an issue logging in, click "Forgot your username or password?" below, or contact:');
    // //Check button text
    // expect(login.textForgotUsernamePassword()).toEqual("Forgot your username or password?");
    // //Click to login
    // login.clickForgotUsernamePassword();
    // expect(browser.getCurrentUrl()).toEqual(forgotUrl);
    //
    // //Enter invalid email
    // loginRecover.enterEmail(invalidEmail);
    // //Check username box is disabled and submit
    // expect(loginRecover.disabledCount()).toEqual(1);
    // expect(element(by.model('passwordRecovery.username')).isEnabled()).toBe(false);
    // //THis is a better way of determining enabled or disabled. THe above line works but the line below does not..not sure why. Below is hte preferred way to do it
    // //expect(loginRecover.userName.isDisabled()).toBe(true); ///Work on an alternate way of checking this field
    // expect(loginRecover.getSubmitButtonText()).toEqual("Submit");
    // loginRecover.clickUsernameSubmit();
    //
    // //Verify error message text
    // expect(loginRecover.getemailNotFoundText()).toEqual("We were unable to locate this email address. If you need assistance, please call NextGear Capital Support at:");
    // expect(loginRecover.getemailNotFoundNumbers()).toContain("United States 1.888.969.3721");
    // expect(loginRecover.getemailNotFoundNumbers()).toContain("Canada - Quebec 1.855.864.9291");
    // expect(loginRecover.getemailNotFoundNumbers()).toContain("Canada - National 1.877.864.9291");
    //
    // //Enter incorrect email and submit
    // loginRecover.enterEmail(invalidFormatEmail);
    // loginRecover.clickUsernameSubmit();
    // expect(loginRecover.getIncorrectEmailFormat()).toContain("is not a valid email address. If you need assistance, please call NextGear Capital Support at:");
    //
    // //Enter correct email and submit
    // loginRecover.enterEmail(validEmail);
    // loginRecover.clickUsernameSubmit();
    //
    // //Verify Success Modal
    //
    // expect(modal.header()).toEqual("Success");
    // expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");
    // //Exit out and verify back to main
    // modal.clickOkButton();
    // expect(browser.getCurrentUrl()).toEqual(homepageUrl);

  });
  xit("4. As a dealer I forgot my password. All my answers are correct", function () {
    //Check button text
    expect(login.textForgotUsernamePassword()).toEqual("Forgot your username or password?");
    login.clickForgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual(forgotUrl);
    //Enter Username
    loginRecover.enterUsername('36017RDT');
    //Validate email address field is disabled and click
    expect(loginRecover.disabledCount()).toEqual(1);
    loginRecover.clickPasswordSubmit();
    //Answer Security Questions and validate
    expect(loginRecover.getSecurityQuestion10Text()).toEqual("What is the name of a college you applied to but didn't attend?");
    loginRecover.enterQuestion10(correctAnswer);
    expect(loginRecover.getSecurityQuestion6Text()).toEqual("In what city or town was your first job?");
    loginRecover.enterQuestion6(correctAnswer);
    expect(loginRecover.getSecurityQuestion9Text()).toEqual("What is your maternal grandmother's maiden name?");
    loginRecover.enterQuestion9(correctAnswer);
    loginRecover.clickPasswordSubmit();
    //Verify Success Modal
    expect(modal.header()).toEqual("Success");
    expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");
    //Exit out and verify back to main
    modal.clickOkButton();
    expect(browser.getCurrentUrl()).toEqual(homepageUrl);

  });

  xit("5. As a dealer I forgot my password. All my answers are NOT correct", function () {
    //Check button text
    expect(login.textForgotUsernamePassword()).toEqual("Forgot your username or password?");
    login.clickForgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual(forgotUrl);
    //Enter Username
    loginRecover.enterUsername(browser.params.userName2);
    //Validate email address field is disabled and click
    expect(loginRecover.disabledCount()).toEqual(1);
    loginRecover.clickPasswordSubmit();
    //Answer Security Questions and validate
    expect(loginRecover.getSecurityQuestion10Text()).toEqual("What is the name of a college you applied to but didn't attend?");
    loginRecover.enterQuestion10(incorrectAnswer);
    expect(loginRecover.getSecurityQuestion6Text()).toEqual("In what city or town was your first job?");
    loginRecover.enterQuestion6(incorrectAnswer);
    expect(loginRecover.getSecurityQuestion9Text()).toEqual("What is your maternal grandmother's maiden name?");
    loginRecover.enterQuestion9(incorrectAnswer);
    loginRecover.clickPasswordSubmit();
    //Verify Success Modal
    expect(loginRecover.getPasswordErrorText()).toEqual("We were unable verify one or more of your answers. If you need assistance, please call NextGear Capital Support at:");
    expect(loginRecover.getPasswordErrorTextPhoneNumber()).toContain("United States 1.888.969.3721");
    expect(loginRecover.getPasswordErrorTextPhoneNumber()).toContain("Canada - Quebec 1.855.864.9291");
    expect(loginRecover.getPasswordErrorTextPhoneNumber()).toContain("Canada - National 1.877.864.9291");
    //Exit out and verify back to main
    loginRecover.enterQuestion10(correctAnswer);
    loginRecover.enterQuestion6(correctAnswer);
    loginRecover.enterQuestion9(correctAnswer);
    loginRecover.clickPasswordSubmit();
    //Verify Success Modal
    expect(modal.header()).toEqual("Success");
    expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");
    //Exit out and verify back to main
    modal.clickOkButton();
    expect(browser.getCurrentUrl()).toEqual(homepageUrl);
  });
});

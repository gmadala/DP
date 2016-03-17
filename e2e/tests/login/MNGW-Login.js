'use strict';

var loginRecover = require('../../framework/login-recover.js');
var login = require('../../framework/login.js');
var modal = require('../../framework/modal_objects.js');
var delay = 200;
var longDelay = 500;

describe("Log In Suite  \n ", function () {

  beforeEach(function () {
    browser.get("https://test.nextgearcapital.com/test/#/login");
    browser.ignoreSynchronization = true;
    browser.sleep(delay);

  });

  it("As a new dealer I want to signup to Mynextgear", function () {
    //Check button text
    expect(login.textsignUpLogin()).toEqual("Sign Up");

    //Click signup
    login.clicksignUpLogin();
    //Validate correct URL
    expect(browser.getCurrentUrl()).toEqual("http://www.nextgearcapital.com/apply-for-credit/");

  });
  it("As a dealer I forgot my user name. My email is correct and no problems", function () {
    //Check Forgot username or password link
    expect(login.textforgotUsernamePassword()).toEqual("Forgot your username or password?");
    login.clickforgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login/recover");

    loginRecover.enterEmail('test@gmail.com');
    expect(loginRecover.getSubmitButtonText()).toEqual("Submit");
    loginRecover.clickUsernameSubmit();

    expect(modal.header()).toEqual("Success");
    expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");

    //Exit out and verify back to main
    modal.clickOkButton();
    expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login");

  });

  it("As a dealer I forgot my user name. My email is NOT correct and have to reenter email", function () {
    //Check button text
    expect(login.textforgotUsernamePassword()).toEqual("Forgot your username or password?");

    login.clickforgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login/recover");

    //Enter invalid email
    loginRecover.enterEmail('sad3e2@gmail.com');
    //Check username box is disabled and submit
    expect(loginRecover.disabledCount()).toEqual(1);
    expect(element(By.model('passwordRecovery.username')).isEnabled()).toBe(false);
    //THis is a better way of determining enabled or disabled. THe above line works but the line below does not..not sure why. Below is hte preferred way to do it
    //expect(loginRecover.userName.isDisabled()).toBe(true); ///Work on an alternate way of checking this field
    expect(loginRecover.getSubmitButtonText()).toEqual("Submit");
    loginRecover.clickUsernameSubmit();

    //Verify error message text
    expect(loginRecover.getemailNotFoundText()).toEqual("We were unable to locate this email address. If you need assistance, please call NextGear Capital Support at:");
    expect(loginRecover.getemailNotFoundNumbers()).toContain("United States 1.888.969.3721");
    expect(loginRecover.getemailNotFoundNumbers()).toContain("Canada - Quebec 1.855.864.9291");
    expect(loginRecover.getemailNotFoundNumbers()).toContain("Canada - National 1.877.864.9291");

    //Enter incorrect email and submit
    loginRecover.enterEmail('sdfsdf');
    loginRecover.clickUsernameSubmit();
    expect(loginRecover.getIncorrectEmailFormat()).toContain("is not a valid email address. If you need assistance, please call NextGear Capital Support at:");

    //Enter correct email and submit
    loginRecover.enterEmail('test@gmail.com');
    loginRecover.clickUsernameSubmit();

    //Verify Success Modal
    expect(modal.header()).toEqual("Success");
    expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");
    //Exit out and verify back to main
    modal.clickOkButton();
    expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login");

  });
  it("As a dealer I forgot my password. All my answers are correct", function () {
    //Check button text
    expect(login.textforgotUsernamePassword()).toEqual("Forgot your username or password?");
    login.clickforgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login/recover");
    //Enter Username
    loginRecover.enterUsername('36017RDT');
    //Validate email address field is disabled and click
    expect(loginRecover.disabledCount()).toEqual(1);
    loginRecover.clickPasswordSubmit();
    //Answer Security Questions and validate
    expect(loginRecover.getSecurityQuestion10Text()).toEqual("What is the name of a college you applied to but didn't attend?");
    loginRecover.enterQuestion10('a');
    expect(loginRecover.getSecurityQuestion6Text()).toEqual("In what city or town was your first job?");
    loginRecover.enterQuestion6('a');
    expect(loginRecover.getSecurityQuestion9Text()).toEqual("What is your maternal grandmother's maiden name?");
    loginRecover.enterQuestion9('a');
    loginRecover.clickPasswordSubmit();
    //Verify Success Modal
    expect(modal.header()).toEqual("Success");
    expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");
    //Exit out and verify back to main
    modal.clickOkButton();
    expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login");

  });

  it("As a dealer I forgot my password. All my answers are NOTcorrect", function () {
    //Check button text
    expect(login.textforgotUsernamePassword()).toEqual("Forgot your username or password?");
    login.clickforgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login/recover");
    //Enter Username
    loginRecover.enterUsername('36017RDT');
    //Validate email address field is disabled and click
    expect(loginRecover.disabledCount()).toEqual(1);
    loginRecover.clickPasswordSubmit();
    //Answer Security Questions and validate
    expect(loginRecover.getSecurityQuestion10Text()).toEqual("What is the name of a college you applied to but didn't attend?");
    loginRecover.enterQuestion10('f');
    expect(loginRecover.getSecurityQuestion6Text()).toEqual("In what city or town was your first job?");
    loginRecover.enterQuestion6('f');
    expect(loginRecover.getSecurityQuestion9Text()).toEqual("What is your maternal grandmother's maiden name?");
    loginRecover.enterQuestion9('f');
    loginRecover.clickPasswordSubmit();
    //Verify Success Modal
    expect(loginRecover.getPasswordErrorText()).toEqual("We were unable verify one or more of your answers. If you need assistance, please call NextGear Capital Support at:");
    expect(loginRecover.getPasswordErrorTextPhoneNumber()).toContain("United States 1.888.969.3721");
    expect(loginRecover.getPasswordErrorTextPhoneNumber()).toContain("Canada - Quebec 1.855.864.9291");
    expect(loginRecover.getPasswordErrorTextPhoneNumber()).toContain("Canada - National 1.877.864.9291");
    //Exit out and verify back to main
    loginRecover.enterQuestion10('a');
    loginRecover.enterQuestion6('a');
    loginRecover.enterQuestion9('a');
    loginRecover.clickPasswordSubmit();
    //Verify Success Modal
    expect(modal.header()).toEqual("Success");
    expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");
    //Exit out and verify back to main
    modal.clickOkButton();
    expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login");
  });
});

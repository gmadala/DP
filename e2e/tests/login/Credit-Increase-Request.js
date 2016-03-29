/**
 * Created by Javier.Calderon on 3/25/2016.
 */
'use strict';

var loginRecover = require('../../framework/login-recover.js');
var login = require('../../framework/login.js');
var modal = require('../../framework/modal_objects.js');
var dashboard = require('../../framework/dashboard-objects.js');
var creditIncrease = require('../../framework/credit-increase-request-objects.js');
var delay = 200;
var longDelay = 500;
var userName= '36017RDT';
var homepageUrl="https://test.nextgearcapital.com/test/#/login";

describe("Log In Suite  \n ", function () {

  beforeEach(function () {
    browser.get(homepageUrl);
    browser.ignoreSynchronization = true;
    browser.sleep(delay);

  });

  it("1. As a dealer I want to request a temporary credit increase", function () {
    login.login2('53190md','ngcpass!0');
    dashboard.clickRequestCreditIncreaset();
    creditIncrease.clickfirstLineOfCredit();
    browser.sleep(5000);

  });
  xit("2. As a dealer I want to request a permanent credit increase", function () {
    //Check Forgot username or password link
    expect(login.textforgotUsernamePassword()).toEqual("Forgot your username or password?");
    login.clickforgotUsernamePassword();
    expect(browser.getCurrentUrl()).toEqual(forgotUrl);

    loginRecover.enterEmail(validEmail);
    expect(loginRecover.getSubmitButtonText()).toEqual("Submit");
    loginRecover.clickUsernameSubmit();

    expect(modal.header()).toEqual("Success");
    expect(modal.body()).toEqual("Thank you, check your email for the requested account information.");

    //Exit out and verify back to main
    modal.clickOkButton();
    expect(browser.getCurrentUrl()).toEqual(homepageUrl);

  });




});

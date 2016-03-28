/**
 * Created by Javier.Calderon on 3/25/2016.
 */
'use strict';

var loginRecover = require('../../framework/login-recover.js');
var login = require('../../framework/login.js');
var modal = require('../../framework/modal_objects.js');
var delay = 200;
var longDelay = 500;
var userName= '36017RDT';

describe("Log In Suite  \n ", function () {

  beforeEach(function () {
    browser.get(homepageUrl);
    browser.ignoreSynchronization = true;
    browser.sleep(delay);

  });

  xit("1. As a dealer I want to request a temporary credit increase", function () {


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

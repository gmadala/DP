'use strict';

var loginObjects = require('../../framework/e2e_login_objects.js');
var promos = require('../../framework/e2e_promos_objects.js');
var login = require('../../framework/e2e_login.js');
var execSettings = require('../../framework/e2e_execSettings.js');
var helper = require('../../framework/e2e_helper_functions.js');

var loginObjects = new loginObjects.loginObjects();
var promos = new promos.promos();
var helper = new helper.helper();

describe('\n Promos Page', function () {

  beforeEach(function () {
    browser.sleep(browser.params.delay);
  });

  it("1. Promos - Login as 97421eh ", function () {
    helper.goToLogin();
    loginObjects.doGoodLogin();
    helper.goToPromos();
    browser.sleep(browser.params.delay);
    expect(browser.getCurrentUrl()).toEqual(execSettings.promosPage());
  });

  it("2. Promos - Validating the Labels and Show Old Promos", function () {
    expect(promos.elImage.isDisplayed()).toBe(true);
    expect(promos.getTextTitle()).toEqual("Please contact your local representative for details about the Promotions and Event Sales listed below.");
    expect(promos.getTextHeader()).toEqual("Promotions / Event Sales");
    expect(promos.elPromotionsDetails.isDisplayed()).toBe(false);
    expect(promos.getTextPromos()).toEqual("Show Old Promos");
    promos.doPromos();
    expect(promos.elPromotionsDetails.isDisplayed()).toBe(true);
    expect(promos.getTextPromos()).toEqual("Hide Old Promos");
    promos.doPromos();
  });

  it("3. Promos - Logout", function () {
    login.logout();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });

});

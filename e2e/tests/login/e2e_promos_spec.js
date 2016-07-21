'use strict';

var loginObjects = require('../../framework/e2e_login_objects.js');
var promos = require('../../framework/e2e_promos_objects.js');
var login = require('../../framework/e2e_login.js');
var execSettings = require('../../framework/e2e_execSettings.js');
var helper = require('../../framework/e2e_helper_functions.js');

var loginObjects = new loginObjects.loginObjects();
var promos = new promos.promos();
var helper = new helper.helper();

describe('Testing Promos Page', function () {

  beforeEach(function () {
    browser.sleep(browser.params.delay);
  });

  it('Promos - Login as 97421eh ', function () {
    helper.goToLogin();
    loginObjects.doGoodLogin();
    helper.goToPromos();
    browser.sleep(browser.params.delay);
    expect(browser.getCurrentUrl() === execSettings.promosPage());
  });

  it('Promos - Validating the Labels', function () {
    expect(promos.elIimage.isDisplayed()).toBe(true);
    expect(promos.getTextTitle()).toEqual("Please contact your local representative for details about the Promotions and Event Sales listed below.");
    expect(promos.getTextHeader()).toEqual("Promotions / Event Sales");
    expect(promos.elPromotionsDetails.isDisplayed()).toBe(false);
    expect(promos.getTextShowPromos()).toEqual("Show Old Promos");
    promos.doShowOldPromos();
    browser.sleep(browser.params.delay);
    expect(promos.elPromotionsDetails.isDisplayed()).toBe(true);
    expect(promos.getTextShowPromos()).toEqual("Hide Old Promos");
    promos.doShowOldPromos();
    browser.sleep(browser.params.delay);
  });

  it("Promos - Logout", function () {
    browser.sleep(browser.params.delay);
    login.logout();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });
});

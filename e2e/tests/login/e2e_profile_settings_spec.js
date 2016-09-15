'use strict';

var helper = require('../../framework/e2e_helper_functions.js');
var login = require('../../framework/e2e_login.js');
// var modalObjects = require('../../framework/e2e_modal_objects.js');
// var dashboard = require('../../framework/e2e_dashboard_objects.js');
// var creditIncrease = require('../../framework/e2e_credit_increase_requ_objects.js');
var profileSettings = require('../../framework/e2e_profile_settings_objects.js');
var execSettings = require('../../framework/e2e_execSettings.js');

// var dashboard = new dashboard.dashboardObjects();
// var CredIncrease = new creditIncrease.creditIncrease();
// var modalObjects = new modalObjects.modalObjects();
var helper = new helper.helper();
var profileSettings = new profileSettings.profileSettingsObjects();

describe('\n Profile Settings Page', function () {
  beforeEach(function () {
    browser.sleep(browser.params.shortDelay);
    browser.ignoreSynchronization = true;
  });

  it("1. Profile Settings - Login as 62434AM ", function () {
    helper.goToLogin();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
    browser.sleep(browser.params.mediumDelay);
    login.login2(browser.params.userName, browser.params.password);
    expect(browser.getCurrentUrl()).toEqual(execSettings.homePage());
  });

  it("2. Profile Settings - Navigating to Profile Settings page  and validating ", function () {
    login.clickMyAccount();
    profileSettings.doProfileSettings();
    expect(browser.getCurrentUrl()).toEqual(execSettings.profileSettingsPage());
    expect(profileSettings.elUserProfile.isDisplayed()).toBe(true);
    //expect(profileSettings.elUserName.isDisplayed()).toBe(true);
    console.log(profileSettings.getTextUsername());
    expect(profileSettings.getTextUsername()).toEqual('62434AM');
  });

  it("5. Profile Settin.lags - Logout", function () {
    login.logout();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });
});

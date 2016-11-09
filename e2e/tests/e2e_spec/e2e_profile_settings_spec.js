'use strict';

var helper = require('../../framework/e2e_helper_functions.js');
var login = require('../../framework/e2e_login.js');
var profileSettings = require('../../framework/e2e_profile_settings_objects.js');
var execSettings = require('../../framework/e2e_execSettings.js');

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
    //Closing popover
    //helper.popOver();
  });

  it("2. Profile Settings - Navigating to Profile Settings page", function () {
    login.clickMyAccount();
    profileSettings.doProfileSettings();
    expect(browser.getCurrentUrl()).toEqual(execSettings.profileSettingsPage());
    //Validating the User Profile Section
    expect(profileSettings.elUserProfile.isDisplayed()).toBe(true);
    expect(profileSettings.elProfileEditSettings.isDisplayed()).toBe(true);
    expect(profileSettings.elProfileCancelSettings.isDisplayed()).toBe(false);
    expect(profileSettings.elProfileSaveSettings.isDisplayed()).toBe(false);
    //Validating the Notification Section
    expect(profileSettings.elNotificationsEditSettings.isDisplayed()).toBe(true);
    expect(profileSettings.elNotificationsCancelSettings.isDisplayed()).toBe(false);
    expect(profileSettings.elNotificationsSaveSettings.isDisplayed()).toBe(false);
  });

  it("3. Profile Settings - Validating the Profile Settings", function () {
    profileSettings.doProfileEditSettings();
    expect(profileSettings.elProfileCancelSettings.isDisplayed()).toBe(true);
    expect(profileSettings.elProfileSaveSettings.isDisplayed()).toBe(true);
    expect(profileSettings.elNotificationsEditSettings.isDisplayed()).toBe(true);
  });

  it("4. Profile Settings - Validating the Notifications Settings", function () {
    profileSettings.doNotificationsEditSettings();
    expect(profileSettings.elNotificationsCancelSettings.isDisplayed()).toBe(true);
    expect(profileSettings.elNotificationsSaveSettings.isDisplayed()).toBe(true);
  });

  it("5. Profile Setting - Logout", function () {
    login.logout();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });

});

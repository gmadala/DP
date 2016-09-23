'use strict';
/**
 * @class profile_settings_objects
 * @author Balanithiya Krishnamoorthy
 * @description Page objects for Profile Settings page elements
 * */

function ProfileSettings() {

  //Locators
  this.elProfileSettings = browser.element(by.css('a[href="#/profile_settings"]'));
  this.elUserProfile = browser.element(by.css('section.panel.panel-default.settings-well'));
  this.elProfileEditSettings = browser.element(by.css('[ng-click="profile.edit()"]'));
  this.elProfileSaveSettings = browser.element(by.css('[ng-click="profile.save()"]'));
  this.elProfileCancelSettings = browser.element(by.css('[ng-click="profile.cancel()"]'));
  this.elNotificationsEditSettings = browser.element(by.css('[ng-click="notifications.edit()"]'));
  this.elNotificationsSaveSettings = browser.element(by.css('[ng-click="notifications.save()"]'));
  this.elNotificationsCancelSettings = browser.element(by.css('[ng-click="notifications.cancel()"]'));

  //Doers
  this.doProfileSettings = function () {
    browser.sleep(browser.sleep(browser.params.shortDelay));
    this.elProfileSettings.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doProfileEditSettings = function () {
    browser.sleep(browser.sleep(browser.params.shortDelay));
    this.elProfileEditSettings.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doNotificationsEditSettings = function () {
    browser.sleep(browser.sleep(browser.params.shortDelay));
    this.elNotificationsEditSettings.click();
    browser.sleep(browser.params.shortDelay);
  };

  //Getters
  this.getTextUsername = function () {
    browser.sleep(browser.sleep(browser.params.shortDelay));
    this.elUserName.getText();
    browser.sleep(browser.params.shortDelay);
  };
}
module.exports.profileSettingsObjects = ProfileSettings;

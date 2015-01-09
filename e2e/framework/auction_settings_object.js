'use strict';

var AuctionSettingsObject = function () {

  this.url = '#/act/settings';

  this.userProfileSection = browser.element(by.cssContainingText('section', 'User Profile'));
  this.usernameField = browser.element(by.model('profile.dirtyData.username'));
  this.passwordField = browser.element(by.model('profile.dirtyData.password'));
  this.passwordConfirmField = browser.element(by.model('profile.dirtyData.passwordConfirm'));
  this.phoneField = browser.element(by.model('profile.dirtyData.phone'));

  this.questions = browser.element(by.repeater('question in profile.dirtyData.questions'));

  this.userEditSettings = this.userProfileSection.element(by.cssContainingText('button', 'Edit Settings'));
  this.userCancelEdit = this.userProfileSection.element(by.cssContainingText('button', 'Cancel'));
  this.userSaveSettings = this.userProfileSection.element(by.cssContainingText('button', 'Save Settings'));

  this.businessSettingsSection = browser.element(by.cssContainingText('section', 'Business Settings'));
  this.emailField = browser.element(by.model('business.dirtyData.email'));
  this.pinField = browser.element(by.model('business.dirtyData.enhancedRegistrationPin'));

  this.businessEditSettings = this.businessSettingsSection.element(by.cssContainingText('button', 'Edit Settings'));
  this.businessCancelEdit = this.businessSettingsSection.element(by.cssContainingText('button', 'Cancel'));
  this.businessSaveSettings = this.businessSettingsSection.element(by.cssContainingText('button', 'Save Settings'));

  this.titleSettingsSection = browser.element(by.cssContainingText('section', 'Title Settings'));
  this.addressOptions = browser.element.all(by.options('addr | address:\'oneLineSelect\' for addr in title.data.addresses'))

  this.titleEditSettings = this.titleSettingsSection.element(by.cssContainingText('button', 'Edit Settings'));
  this.titleCancelEdit = this.titleSettingsSection.element(by.cssContainingText('button', 'Cancel'));
  this.titleSaveSettings = this.titleSettingsSection.element(by.cssContainingText('button', 'Save Settings'));


  this.notificationsSection = browser.element(by.cssContainingText('section', 'Notifications'));

  this.notificationsEditSettings = this.notificationsSection.element(by.cssContainingText('button', 'Edit Settings'));
  this.notificationsCancelEdit = this.notificationsSection.element(by.cssContainingText('button', 'Cancel'));
  this.notificationsSaveSettings = this.notificationsSection.element(by.cssContainingText('button', 'Save Settings'));

  this.openPage = function () {
    browser.get(this.url);
  };

  this.waitForPage = function () {
    var userProfileSection = this.userProfileSection;
    browser.driver.wait(function () {
      return userProfileSection.isDisplayed();
    }, 3000);
  };

  this.elementWithCaption = function (section, caption) {
    return section.element(by.cssContainingText('.row-fluid', caption));
  };

};

module.exports = AuctionSettingsObject;

'use strict';

var AuctionSettingsObject = function () {

  this.url = '#/act/settings';

  this.userProfileSection = browser.element(by.cssContainingText('section', 'User Profile'));
  this.usernameField = browser.element(by.model('profile.dirtyData.username'));
  this.passwordField = browser.element(by.model('profile.dirtyData.password'));
  this.passwordConfirmField = browser.element(by.model('profile.dirtyData.passwordConfirm'));
  this.phoneField = browser.element(by.model('profile.dirtyData.phone'));
  this.emailField = browser.element(by.model('profile.dirtyData.email'));

  this.questions = browser.element.all(by.repeater('question in profile.dirtyData.questions'));

  this.userEditSettings = this.userProfileSection.element(by.cssContainingText('button', 'Edit Settings'));
  this.userCancelEdit = this.userProfileSection.element(by.cssContainingText('button', 'Cancel'));
  this.userSaveSettings = this.userProfileSection.element(by.cssContainingText('button', 'Save Settings'));

  this.businessSettingsSection = browser.element(by.cssContainingText('section', 'Business Settings'));
  this.emailField = browser.element(by.model('business.dirtyData.email'));
  this.pinField = browser.element(by.model('business.dirtyData.enhancedRegistrationPin'));
  this.enhancedRegistrationToggle = browser.element.all(by.model('business.dirtyData.enhancedRegistrationEnabled'));

  this.businessEditSettings = this.businessSettingsSection.element(by.cssContainingText('button', 'Edit Settings'));
  this.businessCancelEdit = this.businessSettingsSection.element(by.cssContainingText('button', 'Cancel'));
  this.businessSaveSettings = this.businessSettingsSection.element(by.cssContainingText('button', 'Save Settings'));

  this.titleSettingsSection = browser.element(by.cssContainingText('section', 'Title Settings'));
  this.addressSelection = browser.element(by.model('title.dirtyData.titleAddress'));
  this.addressOptions = browser.element.all(by.options('addr | address:\'oneLineSelect\' for addr in title.data.addresses'));
  this.defaultAddressesLine = this.titleSettingsSection.element(by.cssContainingText('.row', 'Default'));
  this.additionalAddressesLine = this.titleSettingsSection.element(by.cssContainingText('.row', 'Additional'));
  this.additionalAddressRepeater = this.titleSettingsSection.all(by.repeater('addr in title.data.addresses'));
  this.addressHelpButtons = this.titleSettingsSection.all(by.css('.btn-help'));

  this.titleEditSettings = this.titleSettingsSection.element(by.cssContainingText('button', 'Edit Settings'));
  this.titleCancelEdit = this.titleSettingsSection.element(by.cssContainingText('button', 'Cancel'));
  this.titleSaveSettings = this.titleSettingsSection.element(by.cssContainingText('button', 'Save Settings'));

  this.notificationsSection = browser.element(by.cssContainingText('section', 'Notifications'));
  this.notificationDeliveries = browser.element.all(by.repeater('n in notifications.data.selected'));
  this.notificationAvailable = browser.element.all(by.repeater('n in notifications.dirtyData.available'));

  this.notificationsEditSettings = this.notificationsSection.element(by.cssContainingText('button', 'Edit Settings'));
  this.notificationsCancelEdit = this.notificationsSection.element(by.cssContainingText('button', 'Cancel'));
  this.notificationsSaveSettings = this.notificationsSection.element(by.cssContainingText('button', 'Save Settings'));

  this.elementWithCaption = function (section, caption) {
    return section.element(by.cssContainingText('.row', caption));
  };

  this.displayedAddressHelp = function () {
    var promise = protractor.promise.defer();
    this.addressHelpButtons.each(function (addressHelpButton) {
      addressHelpButton.isDisplayed().then(function (displayed) {
        if (displayed) {
          promise.fulfill(addressHelpButton);
        }
      });
    });
    return promise;
  };

};

module.exports = AuctionSettingsObject;

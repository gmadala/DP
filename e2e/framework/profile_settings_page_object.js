/**
 * Created by gayathrimadala on 1/16/15.
 */

'use strict';

var ProfileSettingsObject = function () {

  this.url = '#/profile_settings';

  this.userSettingsForm = browser.element(by.cssContainingText('section', 'User Profile'));
  this.notificationsForm = browser.element(by.cssContainingText('section', 'Notifications'));

  this.userProfileTitle = browser.element(by.css('.well-title'));
  this.passwordTitle =  browser.element(by.cssContainingText('label','Password'));
  this.secQuestoinOneTitle = browser.element(by.cssContainingText('span', 'Security Question 1'));
  this.secQuestionTwoTitle = browser.element(by.cssContainingText('span', 'Security Question 2'));
  this.secQuestionThreeTitle = browser.element(by.cssContainingText('span', 'Security Question 3'));
  this.emailTitle = browser.element(by.cssContainingText('span', 'Email'));
  this.phoneTitle = browser.element(by.cssContainingText('span', 'Phone'));

  this.notificationsTitle = this.notificationsForm.element(by.css('.well-item'));
  this.floorPlansTitle = this.notificationsForm.element(by.exactBinding('n.NotificationName'));

  this.userEditSettings = this.userSettingsForm.element(by.cssContainingText('span', 'Edit Settings'));
  this.notificationEditSettings = this.notificationsForm.element(by.cssContainingText('span', 'Edit Settings'));

  this.userSaveSettings = this.userSettingsForm.element(by.cssContainingText('span', 'Save Settings'));
  this.notificationSaveSettings = this.notificationsForm.element(by.cssContainingText('span', 'Save Settings'));

  this.userCancelSettings = this.userSettingsForm.element(by.cssContainingText('span', 'Cancel'));
  this.notificationCancelSettings = this.notificationsForm.element(by.cssContainingText('span', 'Cancel'));

  this.userStaticElements = this.userSettingsForm.all(by.css('.static'));
  this.deliveryType = browser.element(by.cssContainingText('label','Delivery Type'));
  this.repeaterOptions = browser.element.all(by.repeater('n in notifications.data.selected'));
  this.floorPlansText = this.repeaterOptions.all(by.exactBinding('d.DeliveryMethodName'));

  this.notificationOptions = browser.element.all(by.repeater('n in notifications.dirtyData.available'));
  this.notificationMessage = browser.element(by.cssContainingText('li','No notifications are currently enabled.'));

  //User Profile Edit settings
  this.usernameEdit = browser.element(by.model('profile.dirtyData.username'));
  this.passwordEdit = browser.element(by.model('profile.dirtyData.password'));
  this.helpIcon = browser.element(by.css('.svg-icon.icon-help'));
  this.confirmPasswordEdit = browser.element(by.model('profile.dirtyData.passwordConfirm'));
  this.questionOptions = browser.element.all(by.repeater('question in profile.dirtyData.questions'));
  this.emailEdit = browser.element(by.model('profile.dirtyData.email'));
  this.phoneEdit = browser.element(by.model('profile.dirtyData.phone'));


  this.openPage = function () {
    browser.ignoreSynchronization = true;
    browser.get(this.url);

  };

  this.waitForPage = function () {
    var userProfileTle = this.userProfileTitle;
    browser.driver.wait(function () {
      return userProfileTle.isPresent();
    }, 3000);
  };
};

module.exports = ProfileSettingsObject;


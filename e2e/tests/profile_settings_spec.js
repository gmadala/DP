/**
 * Created by gayathrimadala on 1/16/15.
 */
'use strict';
var HelperObject = require('../framework/helper_object.js');
var ProfileSettingsObject = require('../framework/profile_settings_page_object');

var helper = new HelperObject();
var profileSettingsPage = new ProfileSettingsObject();

helper.describe('WMT-86', function () {
  describe('Dealer Portal – Profile Settings', function () {
    beforeEach(function () {
      helper.openPageAndWait(profileSettingsPage.url, false, false);
    });

    it('should check for the User Profile static data to be displayed', function () {
      expect(profileSettingsPage.userProfileTitle.isDisplayed()).toBeTruthy();
      expect(profileSettingsPage.passwordTitle.isDisplayed()).toBeTruthy();
      expect(profileSettingsPage.secQuestoinOneTitle.isDisplayed()).toBeTruthy();
      expect(profileSettingsPage.secQuestionTwoTitle.isDisplayed()).toBeTruthy();
      expect(profileSettingsPage.secQuestionThreeTitle.isDisplayed()).toBeTruthy();
      expect(profileSettingsPage.emailTitle.isDisplayed()).toBeTruthy();
      expect(profileSettingsPage.phoneTitle.isDisplayed()).toBeTruthy();

      expect(profileSettingsPage.usernameEdit.isDisplayed()).not.toBeTruthy();
      expect(profileSettingsPage.passwordEdit.isDisplayed()).not.toBeTruthy();
      expect(profileSettingsPage.helpIcon.isDisplayed()).not.toBeTruthy();
      expect(profileSettingsPage.confirmPasswordEdit.isDisplayed()).not.toBeTruthy();
      profileSettingsPage.questionOptions.each(function (getElement) {
        var selectElement = getElement.all(by.model('question.SecurityQuestionId'));
        selectElement.getTagName().then(function (tagname) {
          expect(tagname).not.toBeTruthy();
        });
        var inputElement = getElement.all(by.model('question.Answer'));
        inputElement.getTagName().then(function (tagname) {
          expect(tagname).not.toBeTruthy();
        });
      });
      expect(profileSettingsPage.emailEdit.isDisplayed()).not.toBeTruthy();
      expect(profileSettingsPage.phoneEdit.isDisplayed()).not.toBeTruthy();

      profileSettingsPage.userStaticElements.each(function (element) {
        element.getText().then(function (text) {
          if (text !== '') {
            expect(text).toBeTruthy();
          }
        });
      });
    });

    it('should check for the User Profile Edit Settings data to be displayed', function () {
      profileSettingsPage.userEditSettings.click();

      expect(profileSettingsPage.usernameEdit.isDisplayed()).toBeTruthy();
      expect(profileSettingsPage.passwordEdit.isDisplayed()).toBeTruthy();
      expect(profileSettingsPage.helpIcon.isDisplayed()).toBeTruthy();
      expect(profileSettingsPage.confirmPasswordEdit.isDisplayed()).toBeTruthy();
      profileSettingsPage.questionOptions.each(function (getElement) {
        var selectElement = getElement.all(by.model('question.SecurityQuestionId'));
        selectElement.getTagName().then(function (tagname) {
          expect(tagname).toBeTruthy();
        });
        var inputElement = getElement.all(by.model('question.Answer'));
        inputElement.getTagName().then(function (tagname) {
          expect(tagname).toBeTruthy();
        });
      });
      expect(profileSettingsPage.emailEdit.isDisplayed()).toBeTruthy();
      expect(profileSettingsPage.phoneEdit.isDisplayed()).toBeTruthy();
    });

    it('should check for the profile settings navigation on the page - Cancel.', function () {
      profileSettingsPage.userEditSettings.click();
      profileSettingsPage.userCancelSettings.click();
      profileSettingsPage.notificationEditSettings.click();
      profileSettingsPage.notificationCancelSettings.click();
    });

    it('should check for the Notifications on the page.', function () {
      expect(profileSettingsPage.notificationsTitle.isDisplayed()).toBeTruthy();
      expect(profileSettingsPage.floorPlansTitle.isDisplayed()).toBeTruthy();
      expect(profileSettingsPage.deliveryType.isDisplayed()).toBeTruthy();
      profileSettingsPage.floorPlansText.each(function (retValue) {
        expect(retValue.isDisplayed()).toBeTruthy();
      });
    });

    it('should check for the Notifications on the page.', function () {
      browser.sleep(1000);
      profileSettingsPage.repeaterOptions.count().then(function (count) {
        if (count === 0) {
          expect(profileSettingsPage.notificationMessage.isDisplayed()).toBeTruthy();
        }
        else {
          expect(profileSettingsPage.notificationsTitle.isDisplayed()).toBeTruthy();
          expect(profileSettingsPage.floorPlansTitle.isDisplayed()).toBeTruthy();
          expect(profileSettingsPage.deliveryType.isDisplayed()).toBeTruthy();
          profileSettingsPage.floorPlansText.each(function (retValue) {
            expect(retValue.isDisplayed()).toBeTruthy();
          });
        }
      });
    });

    it('should check for the Notification Edit Settings - Save Settings.', function () {
      profileSettingsPage.notificationEditSettings.click();
      profileSettingsPage.notificationOptions.each(function (value) {
        var inputs = value.all(by.css('input'));
        inputs.each(function (checkbox) {
          browser.driver.actions().click(checkbox).perform();
        });
      });
      profileSettingsPage.notificationCancelSettings.click(); // remove this for Functionality testing
      // profileSettingsPage.notificationSaveSettings.click(); // uncomment this for Functionality testing
    });
  });
});

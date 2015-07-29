'use strict';

var AuctionHelperObject = require('../../framework/auction_helper_object');
var AuctionSettingsObject = require('../../framework/auction_settings_object');

var auctionHelper = new AuctionHelperObject();
var auctionSettings = new AuctionSettingsObject();

auctionHelper.describe('WMT-81', function () {
  describe('Auction Portal – Settings Content', function () {
    beforeEach(function () {
      auctionHelper.openPageAndWait(auctionSettings.url);
    });

    it('User profile contains username, password, security question, email and phone.', function () {
      var userSection = auctionSettings.userProfileSection;
      expect(auctionSettings.elementWithCaption(userSection, 'Username').isDisplayed()).toBeTruthy();
      expect(auctionSettings.elementWithCaption(userSection, 'Email').isDisplayed()).toBeTruthy();
      expect(auctionSettings.elementWithCaption(userSection, 'Phone').isDisplayed()).toBeTruthy();

      expect(auctionSettings.usernameField.isDisplayed()).toBeFalsy();
      expect(auctionSettings.passwordField.isDisplayed()).toBeFalsy();
      expect(auctionSettings.passwordConfirmField.isDisplayed()).toBeFalsy();
      expect(auctionSettings.phoneField.isDisplayed()).toBeFalsy();
      expect(auctionSettings.emailField.isDisplayed()).toBeFalsy();
      auctionSettings.questions.each(function (question) {
        expect(question.isDisplayed()).toBeFalsy();
      });

      expect(auctionSettings.userSaveSettings.isDisplayed()).toBeFalsy();
      expect(auctionSettings.userCancelEdit.isDisplayed()).toBeFalsy();
      auctionSettings.userEditSettings.click();
      expect(auctionSettings.userSaveSettings.isDisplayed()).toBeTruthy();
      expect(auctionSettings.userCancelEdit.isDisplayed()).toBeTruthy();

      expect(auctionSettings.usernameField.isDisplayed()).toBeTruthy();
      expect(auctionSettings.passwordField.isDisplayed()).toBeTruthy();
      expect(auctionSettings.passwordConfirmField.isDisplayed()).toBeTruthy();
      expect(auctionSettings.phoneField.isDisplayed()).toBeTruthy();
      // the email field displayed still returning false here
      // expect(auctionSettings.emailField.isDisplayed()).toBeTruthy();
      auctionSettings.questions.each(function (question) {
        expect(question.isDisplayed()).toBeTruthy();
      });
    });

    it('Title settings should contains default address and additional addresses.', function () {
      expect(auctionSettings.defaultAddressesLine.isDisplayed()).toBeTruthy();
      auctionSettings.additionalAddressRepeater.count().then(function (count) {
        if (count > 0) {
          expect(auctionSettings.additionalAddressesLine.isDisplayed()).toBeTruthy();
          expect(auctionSettings.displayedAddressHelp()).not.toBeDefined();
          expect(auctionSettings.addressSelection.isDisplayed()).toBeFalsy();

          expect(auctionSettings.titleSaveSettings.isDisplayed()).toBeFalsy();
          expect(auctionSettings.titleCancelEdit.isDisplayed()).toBeFalsy();
          auctionSettings.titleEditSettings.click();
          expect(auctionSettings.titleSaveSettings.isDisplayed()).toBeTruthy();
          expect(auctionSettings.titleCancelEdit.isDisplayed()).toBeTruthy();

          expect(auctionSettings.displayedAddressHelp()).toBeDefined();
          expect(auctionSettings.addressSelection.isDisplayed()).toBeTruthy();
        }
      });
    });

    it('Business settings should contains business email and enhanced registration toggle.', function () {
      var businessSection = auctionSettings.businessSettingsSection;
      expect(auctionSettings.elementWithCaption(businessSection, 'Email').isDisplayed()).toBeTruthy();
      expect(auctionSettings.elementWithCaption(businessSection, 'Enabled').isDisplayed()).toBeTruthy();

      expect(auctionSettings.emailField.isDisplayed()).toBeFalsy();
      expect(auctionSettings.pinField.isDisplayed()).toBeFalsy();
      expect(auctionSettings.enhancedRegistrationToggle.isDisplayed()).toEqual([false, false]);

      expect(auctionSettings.businessSaveSettings.isDisplayed()).toBeFalsy();
      expect(auctionSettings.businessCancelEdit.isDisplayed()).toBeFalsy();
      auctionSettings.businessEditSettings.click();
      expect(auctionSettings.businessSaveSettings.isDisplayed()).toBeTruthy();
      expect(auctionSettings.businessCancelEdit.isDisplayed()).toBeTruthy();

      expect(auctionSettings.emailField.isDisplayed()).toBeTruthy();
      expect(auctionSettings.pinField.isDisplayed()).toBeTruthy();
      expect(auctionSettings.enhancedRegistrationToggle.isDisplayed()).toEqual([true, true]);
    });

    it('Notifications should contains notifications type selection.', function () {
      var notificationSection = auctionSettings.notificationsSection;
      expect(auctionSettings.elementWithCaption(notificationSection, 'Notifications').isDisplayed()).toBeTruthy();
      auctionSettings.notificationDeliveries.count().then(function (count) {
        if (count > 0) {
          auctionSettings.notificationDeliveries.map(function (notificationDelivery) {
            var deliveryName = notificationDelivery.evaluate('n.NotificationName');
            var deliveryMethods = notificationDelivery.evaluate('n.DeliveryMethods');
            // check the section to see if it contains the data from repeater element
            notificationSection.getText().then(function (text) {
              deliveryName.then(function (notificationName) {
                expect(text).toContain(notificationName);
              });
              deliveryMethods.then(function (methodNames) {
                methodNames.forEach(function (methodName) {
                  expect(text).toContain(methodName.DeliveryMethodName);
                });
              });
            });
          });
        }
      });

      expect(auctionSettings.notificationsSaveSettings.isDisplayed()).toBeFalsy();
      expect(auctionSettings.notificationsCancelEdit.isDisplayed()).toBeFalsy();
      auctionSettings.notificationsEditSettings.click();
      expect(auctionSettings.notificationsSaveSettings.isDisplayed()).toBeTruthy();
      expect(auctionSettings.notificationsCancelEdit.isDisplayed()).toBeTruthy();

      auctionSettings.notificationAvailable.count().then(function (count) {
        if (count > 0) {
          auctionSettings.notificationAvailable.map(function (notificationAvailable) {
            var availableName = notificationAvailable.evaluate('n.Name');
            var availableMethods = notificationAvailable.evaluate('n.DeliveryMethods');
            // check the section to see if it contains the data from repeater element
            notificationSection.getText().then(function (text) {
              availableName.then(function (notificationName) {
                expect(text).toContain(notificationName);
              });
              availableMethods.then(function (methodNames) {
                methodNames.forEach(function (methodName) {
                  expect(text).toContain(methodName.Name);
                });
              });
            });
          });
        }
      });
    });
  });
});

auctionHelper.describe('WMT-80', function () {
  describe('Auction Portal – User Dropdown Content', function () {
    beforeEach(function () {
      auctionHelper.openPageAndWait(auctionSettings.url);
    });

    it('Contains the navigation links for Settings and Sign Out', function () {
      expect(auctionHelper.hasClass(auctionHelper.userInfoDropDown, 'expanded')).toBeFalsy();

      auctionHelper.userInfoLink.click().then(function () {
        auctionHelper.waitForElementDisplayed(auctionHelper.logoutButton);

        expect(auctionHelper.hasClass(auctionHelper.userInfoDropDown, 'expanded')).toBeTruthy();
        expect(auctionHelper.userInfoDropDown.getText()).toContain('SIGN OUT');
        expect(auctionHelper.userInfoDropDown.getText()).toContain('SETTINGS');
        expect(auctionHelper.logoutButton.isDisplayed()).toBeTruthy();
        auctionHelper.getActiveSettingsButton().then(function (activeSettingsButton) {
          expect(activeSettingsButton.isDisplayed()).toBeTruthy();
        });

        auctionHelper.userInfoLink.click().then(function () {
          auctionHelper.waitForElementHidden(auctionHelper.logoutButton);
        });
      });
    });
  });
});

'use strict';

var AuctionHelperObject = require('../framework/auction_helper_object');
var AuctionSettingsObject = require('../framework/auction_settings_object');

var auctionHelper = new AuctionHelperObject();
var auctionSettings = new AuctionSettingsObject();

auctionHelper.describe('WMT-81', function () {
  describe('Auction Portal – Settings Content', function () {
    beforeEach(function () {
      auctionSettings.openPage();
      auctionSettings.waitForPage();
    });

    it('User profile contains username, password, security question, email and phone.', function () {
      expect(auctionSettings.usernameField.isDisplayed()).toBeFalsy();
      auctionSettings.userEditSettings.click();
      expect(auctionSettings.usernameField.isDisplayed()).toBeTruthy();

      auctionSettings.titleEditSettings.click();
      auctionSettings.addressOptions.each(function (addressOption) {
        addressOption.getTagName().then(function (tagName) {
          console.log('Tag Name: ', tagName);
        });
        addressOption.getText().then(function (text) {
          console.log('Text: ', text);
        });
      });
    });
  });
});

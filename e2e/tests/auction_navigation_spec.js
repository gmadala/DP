'use strict';

var AuctionHelperObject = require('../framework/auction_helper_object');
var AuctionNavObject = require('../framework/auction_navigation_object');

var auctionHelperObject = new AuctionHelperObject();
var auctionNavObject = new AuctionNavObject();

auctionHelperObject.describe('WMT-61', function () {
  describe('Auction Portal High Level Navigation Options', function () {

    it('Successful login navigates to Dashboard', function () {
      expect(browser.driver.getCurrentUrl()).toContain('act/home');
      expect(auctionNavObject.navLinks.count()).toEqual(6);
    });

    it('Dashboard navigation option navigates to Dashboard', function () {
      auctionNavObject.getNavLink('Dashboard').then(function (navLink) {
        navLink.click();
      });
      expect(browser.driver.getCurrentUrl()).toContain('act/home');
    });

    it('Dealer Search navigation option navigates to Dealer Search', function () {
      auctionNavObject.getNavLink('Dealer Search').then(function (navLink) {
        navLink.click();
      });
      expect(browser.driver.getCurrentUrl()).toContain('act/dealersearch');
    });

    it('Floor A Vehicle navigation option navigates to Floor A Vehicle', function () {
      auctionNavObject.getNavLink('Floor a Vehicle').then(function (navLink) {
        navLink.click();
      });
      expect(browser.driver.getCurrentUrl()).toContain('act/bulkflooring');
    });

    it('Seller Floor Plan Search navigation option navigates to Seller Floor Plan Search', function () {
      auctionNavObject.getNavLink('Seller Floor Plan Search').then(function (navLink) {
        navLink.click();
      });
      expect(browser.driver.getCurrentUrl()).toContain('act/sellerfloorplan');
    });

    it('View A Report navigation option navigates to View A Report', function () {
      auctionNavObject.getNavLink('View a Report').then(function (navLink) {
        navLink.click();
      });
      expect(browser.driver.getCurrentUrl()).toContain('act/reports');
    });

    it('Resources option navigates to Resources', function () {
      auctionNavObject.getNavLink('Resources').then(function (navLink) {
        navLink.click();
      });
      expect(browser.driver.getCurrentUrl()).toContain('act/documents');
    });

    it('Settings navigation option navigates to Settings', function () {
      var settingsUrl = 'act/settings';
      var dropDownElement = auctionHelperObject.userInfoDropDown;

      expect(browser.driver.getCurrentUrl()).not.toContain(settingsUrl);
      expect(auctionHelperObject.hasClass(dropDownElement, 'expanded')).toBeFalsy();
      auctionHelperObject.userInfoLink.click();
      expect(auctionHelperObject.hasClass(dropDownElement, 'expanded')).toBeTruthy();
      auctionHelperObject.getActiveSettingsButton().then(function (activeSettingsButton) {
        activeSettingsButton.click();
      });
      expect(browser.driver.getCurrentUrl()).toContain(settingsUrl);
    });

    it('Sign Out navigation option navigates to Sign Out confirmation modal', function () {
      var logoutModalHeader = 'Logout';
      var dropDownElement = auctionHelperObject.userInfoDropDown;

      expect(auctionHelperObject.hasClass(dropDownElement, 'expanded')).toBeFalsy();
      auctionHelperObject.userInfoLink.click();
      expect(auctionHelperObject.hasClass(dropDownElement, 'expanded')).toBeTruthy();
      auctionHelperObject.logoutButton.click();
      expect(auctionHelperObject.modal.isDisplayed()).toBeTruthy();
      expect(auctionHelperObject.modalHeader.getText()).toEqual(logoutModalHeader);
      auctionHelperObject.noButton.click();
      auctionHelperObject.userInfoLink.click();
      expect(auctionHelperObject.hasClass(dropDownElement, 'expanded')).toBeFalsy();
    });

    it('Sign Out confirmation modal selection of “No, Thanks” closes modal', function () {
      var logoutModalHeader = 'Logout';
      var dropDownElement = auctionHelperObject.userInfoDropDown;

      expect(auctionHelperObject.hasClass(dropDownElement, 'expanded')).toBeFalsy();
      auctionHelperObject.userInfoLink.click();
      expect(auctionHelperObject.hasClass(dropDownElement, 'expanded')).toBeTruthy();
      auctionHelperObject.logoutButton.click();
      expect(auctionHelperObject.modal.isDisplayed()).toBeTruthy();
      expect(auctionHelperObject.modalHeader.getText()).toEqual(logoutModalHeader);
      auctionHelperObject.noButton.click();
      auctionHelperObject.userInfoLink.click();
      expect(auctionHelperObject.hasClass(dropDownElement, 'expanded')).toBeFalsy();
    });

    it('Sign Out confirmation modal selection of “Yes” signs user out of the application', function () {

      var logoutModalHeader = 'Logout';
      var dropDownElement = auctionHelperObject.userInfoDropDown;

      expect(auctionHelperObject.hasClass(dropDownElement, 'expanded')).toBeFalsy();
      auctionHelperObject.userInfoLink.click();
      expect(auctionHelperObject.hasClass(dropDownElement, 'expanded')).toBeTruthy();
      auctionHelperObject.logoutButton.click();
      expect(auctionHelperObject.modal.isDisplayed()).toBeTruthy();
      expect(auctionHelperObject.modalHeader.getText()).toEqual(logoutModalHeader);
      auctionHelperObject.yesButton.click();
      expect(browser.driver.getCurrentUrl()).toContain(auctionHelperObject.loginUrl);
      auctionHelperObject.loginAsAuction('auction', 'test');
      expect(browser.driver.getCurrentUrl()).not.toContain(auctionHelperObject.loginUrl);
    });

    it('Privacy Statement in footer navigates to privacy statement', function () {
      auctionHelperObject.privacyStatement.click();
      browser.driver.getAllWindowHandles().then(function (handles) {
        var appPageHandle = handles[0];
        var privacyPageHandle = handles[1];
        browser.driver.switchTo().window(privacyPageHandle).then(function () {
          browser.driver.getTitle().then(function (title) {
            expect(title.toLowerCase()).toContain('Privacy statement'.toLowerCase());
            browser.driver.close().then(function () {
              browser.driver.switchTo().window(appPageHandle);
            });
          });
        });
      });
    });

    it('Contact Us in footer navigates to contact information', function () {
      auctionHelperObject.contactUs.click();
      browser.driver.getAllWindowHandles().then(function (handles) {
        var appPageHandle = handles[0];
        var contactPageHandle = handles[1];
        browser.driver.switchTo().window(contactPageHandle).then(function () {
          browser.driver.getTitle().then(function (title) {
            expect(title.toLowerCase()).toContain('Contact'.toLowerCase());
            browser.driver.close().then(function () {
              browser.driver.switchTo().window(appPageHandle);
            });
          });
        });
      });
    });

    it('Feedback & Support opens Feedback & Support modal', function () {
      auctionHelperObject.getActiveFeedbackButton().then(function (activeFeedbackButton) {
        activeFeedbackButton.click();
      });
      var feedbackModal = browser.element(by.id('uvw-dialog-uv-2'));
      expect(feedbackModal.isDisplayed()).toBeTruthy();
      auctionHelperObject.closeFeedbackButton.click();
    });

    it('The NextGear Logo activation navigates to the DashBoard.', function () {
      auctionNavObject.getNavLink('View a Report').then(function (navLink) {
        navLink.click();
      });
      expect(browser.driver.getCurrentUrl()).toContain('act/reports');
      auctionHelperObject.webLogo.click();
      expect(browser.driver.getCurrentUrl()).toContain('act/home');
    });
  });
});

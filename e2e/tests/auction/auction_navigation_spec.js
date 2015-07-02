'use strict';

var AuctionHelperObject = require('../../framework/auction_helper_object');
var AuctionNavObject = require('../../framework/auction_navigation_object');

var auctionHelper = new AuctionHelperObject();
var auctionNav = new AuctionNavObject();

auctionHelper.describe('WMT-61', function () {
  describe('Auction Portal High Level Navigation Options', function () {
    beforeEach(function () {
      auctionHelper.expectingLoading();
    });

    it('Successful login navigates to Dashboard', function () {
      expect(browser.driver.getCurrentUrl()).toContain('act/home');
      expect(auctionNav.navLinks.count()).toEqual(6);
    });

    it('Dashboard navigation option navigates to Dashboard', function () {
      auctionNav.getNavLink('Dashboard').then(function (navLink) {
        navLink.click().then(function () {
          expect(browser.driver.getCurrentUrl()).toContain('act/home');
        });
      });
      auctionHelper.waitForUrlToContains('act/home');
    });

    it('Dealer Search navigation option navigates to Dealer Search', function () {
      auctionNav.getNavLink('Dealer Search').then(function (navLink) {
        navLink.click().then(function () {
          expect(browser.driver.getCurrentUrl()).toContain('act/dealersearch');
        });
      });
      auctionHelper.waitForUrlToContains('act/dealersearch');
    });

    it('Floor A Vehicle navigation option navigates to Floor A Vehicle', function () {
      auctionNav.getNavLink('Floor a Vehicle').then(function (navLink) {
        navLink.click().then(function () {
          expect(browser.driver.getCurrentUrl()).toContain('act/bulkflooring');
        });
      });
      auctionHelper.waitForUrlToContains('act/bulkflooring');
    });

    it('Seller Floor Plan Search navigation option navigates to Seller Floor Plan Search', function () {
      auctionNav.getNavLink('Seller Floor Plan Search').then(function (navLink) {
        navLink.click().then(function () {
          expect(browser.driver.getCurrentUrl()).toContain('act/sellerfloorplan');
        });
      });
      auctionHelper.waitForUrlToContains('act/sellerfloorplan');
    });

    it('View A Report navigation option navigates to View A Report', function () {
      auctionNav.getNavLink('View a Report').then(function (navLink) {
        navLink.click().then(function () {
          expect(browser.driver.getCurrentUrl()).toContain('act/reports');
        });
      });
      auctionHelper.waitForUrlToContains('act/reports');
    });

    it('Resources option navigates to Resources', function () {
      auctionNav.getNavLink('Resources').then(function (navLink) {
        navLink.click().then(function () {
          expect(browser.driver.getCurrentUrl()).toContain('act/documents');
        });
      });
      auctionHelper.waitForUrlToContains('act/documents');
    });

    it('Settings navigation option navigates to Settings', function () {
      var settingsUrl = 'act/settings';
      var dropDownElement = auctionHelper.userInfoDropDown;

      expect(browser.driver.getCurrentUrl()).not.toContain(settingsUrl);
      expect(auctionHelper.hasClass(dropDownElement, 'expanded')).toBeFalsy();
      auctionHelper.userInfoLink.click().then(function () {
        expect(auctionHelper.hasClass(dropDownElement, 'expanded')).toBeTruthy();

        auctionHelper.waitForElementDisplayed(auctionHelper.logoutButton);
        auctionHelper.getActiveSettingsButton().then(function (activeSettingsButton) {
          activeSettingsButton.click().then(function () {
            auctionHelper.waitForElementHidden(auctionHelper.logoutButton);
            expect(browser.driver.getCurrentUrl()).toContain(settingsUrl);
            expect(auctionHelper.hasClass(dropDownElement, 'expanded')).toBeFalsy();
          });
        });
      });
    });

    it('Sign Out navigation option navigates to Sign Out confirmation modal', function () {
      var logoutModalHeader = 'Logout';
      var dropDownElement = auctionHelper.userInfoDropDown;

      expect(auctionHelper.hasClass(dropDownElement, 'expanded')).toBeFalsy();
      auctionHelper.userInfoLink.click().then(function () {
        expect(auctionHelper.hasClass(dropDownElement, 'expanded')).toBeTruthy();

        auctionHelper.waitForElementDisplayed(auctionHelper.logoutButton);
        auctionHelper.logoutButton.click().then(function () {
          expect(auctionHelper.modal.isDisplayed()).toBeTruthy();
          expect(auctionHelper.modalHeader.getText()).toEqual(logoutModalHeader);

          auctionHelper.noButton.click().then(function () {
            auctionHelper.userInfoLink.click().then(function () {
              expect(auctionHelper.hasClass(dropDownElement, 'expanded')).toBeFalsy();
              auctionHelper.waitForElementHidden(auctionHelper.logoutButton);
            });
          });
        });
      });
    });

    it('Sign Out confirmation modal selection of “No, Thanks” closes modal', function () {
      var logoutModalHeader = 'Logout';
      var dropDownElement = auctionHelper.userInfoDropDown;

      expect(auctionHelper.hasClass(dropDownElement, 'expanded')).toBeFalsy();
      auctionHelper.userInfoLink.click().then(function () {
        expect(auctionHelper.hasClass(dropDownElement, 'expanded')).toBeTruthy();

        auctionHelper.waitForElementDisplayed(auctionHelper.logoutButton);
        auctionHelper.logoutButton.click().then(function () {
          expect(auctionHelper.modal.isDisplayed()).toBeTruthy();
          expect(auctionHelper.modalHeader.getText()).toEqual(logoutModalHeader);

          auctionHelper.noButton.click().then(function () {
            auctionHelper.userInfoLink.click().then(function () {
              expect(auctionHelper.hasClass(dropDownElement, 'expanded')).toBeFalsy();
              auctionHelper.waitForElementHidden(auctionHelper.logoutButton);
            });
          });
        });
      });
    });

    it('Sign Out confirmation modal selection of “Yes” signs user out of the application', function () {
      var logoutModalHeader = 'Logout';
      var dropDownElement = auctionHelper.userInfoDropDown;

      expect(auctionHelper.hasClass(dropDownElement, 'expanded')).toBeFalsy();
      auctionHelper.userInfoLink.click().then(function () {
        expect(auctionHelper.hasClass(dropDownElement, 'expanded')).toBeTruthy();

        auctionHelper.waitForElementDisplayed(auctionHelper.logoutButton);
        auctionHelper.logoutButton.click().then(function () {
          expect(auctionHelper.modal.isDisplayed()).toBeTruthy();
          expect(auctionHelper.modalHeader.getText()).toEqual(logoutModalHeader);

          auctionHelper.yesButton.click().then(function () {
            auctionHelper.waitForUrlToContains('login');
            expect(browser.driver.getCurrentUrl()).toContain(auctionHelper.loginUrl);
            auctionHelper.login();
            expect(browser.driver.getCurrentUrl()).not.toContain(auctionHelper.loginUrl);
          });
        });
      });
    });

    it('Privacy Statement in footer navigates to privacy statement', function () {
      auctionHelper.privacyStatement.click().then(function () {
        browser.driver.getAllWindowHandles().then(function (handles) {
          var appPageHandle = handles[0];
          var privacyPageHandle = handles[1];
          browser.driver.switchTo().window(privacyPageHandle).then(function () {
            browser.driver.getTitle().then(function (title) {
              expect(title.toLowerCase()).toContain('Privacy'.toLowerCase());
              browser.driver.close().then(function () {
                browser.driver.switchTo().window(appPageHandle);
              });
            });
          });
        });
      });
    });

    it('Contact Us in footer navigates to contact information', function () {
      auctionHelper.contactUs.click().then(function () {
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
    });

    xit('Feedback & Support opens Feedback & Support modal', function () {
      auctionHelper.getActiveFeedbackButton().then(function (activeFeedbackButton) {
        activeFeedbackButton.click().then(function () {
          var feedbackModal = browser.element(by.id('uvw-dialog-uv-2'));
          expect(feedbackModal.isDisplayed()).toBeTruthy();
          auctionHelper.closeFeedbackButton.click();
        });
      });
    });

    it('The NextGear Logo activation navigates to the DashBoard.', function () {
      auctionNav.getNavLink('View a Report').then(function (navLink) {
        navLink.click().then(function () {
          expect(browser.driver.getCurrentUrl()).toContain('act/reports');
          auctionHelper.webLogo.click().then(function () {
            expect(browser.driver.getCurrentUrl()).toContain('act/home');
          });
        });
      });
    });
  });
});

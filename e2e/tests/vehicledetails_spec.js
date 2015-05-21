/**
 * Created by gayathrimadala on 12/29/14.
 */

'use strict';
var HelperObject = require('../framework/helper_object');
var vehicleDetailObject = require('../framework/vehicledetails_page_object.js');

var helper = new HelperObject();
var vehiclePage = new vehicleDetailObject();

helper.describe('WMT-58', function () {
  //Floor Plan Page
  describe('Vehicle Details Page', function () {

    beforeEach(function () {
      browser.ignoreSynchronization = true;
      browser.get(vehiclePage.vehicledetailsUrl);
    });

    it('should check for the Request an Extension - Cancel Request', function () {
      expect(browser.getCurrentUrl()).toContain(vehiclePage.vehicledetailsUrl);
      vehiclePage.goToRequestExtension();
      vehiclePage.goToCancelRequest();
    });

    it('should check for the Request an Extension - Confirm Request', function () {
      expect(browser.getCurrentUrl()).toContain(vehiclePage.vehicledetailsUrl);
      vehiclePage.goToRequestExtension();
      vehiclePage.goToConfirmRequest();
    });

    it('should check for payment options and breakdown - CancelChanges.', function () {
      optionsbreakdown();
      vehiclePage.goToCancelChanges();
      //browser.sleep(5000);
    });

    it('should check for payment options and breakdown - ConfirmChanges.', function () {
      optionsbreakdown();
      vehiclePage.goToConfirmChanges();
    });

    it('should check for change inventory location - Save Changes', function () {
      changeInventory();
      expect(vehiclePage.inventorySave.isDisplayed()).toBeTruthy();
      vehiclePage.goToInventorySave();
    });

    it('should navigate to Vehicle History Detail Report.', function () {
      expect(browser.getCurrentUrl()).toContain(vehiclePage.vehicledetailsUrl);
      expect(vehiclePage.vehicleHistory.isDisplayed()).toBeTruthy();
      browser.driver.getAllWindowHandles().then(function (handles) {
        expect(handles.length).toEqual(1);
      });
      expect(vehiclePage.vehicleHistory).toBeDefined();
      vehiclePage.vehicleHistory.then(function (vehicleDetailLink) {
        vehicleDetailLink.click();
      });

      browser.driver.getAllWindowHandles().then(function (handles) {
        expect(handles.length).toEqual(1);
        var firstHandle = handles[0];
        browser.executeScript('return window.location.href').then(function (url) {
          expect(url).not.toContain(vehiclePage.vehicledetailsUrl);
          browser.switchTo().window(firstHandle);
          browser.executeScript('window.history.back()');
        });
      });
    });

    it('should check for Payment Activity - Show/Hide', function () {
      expect(browser.getCurrentUrl()).toContain(vehiclePage.vehicledetailsUrl);
      expect(vehiclePage.showHidePayActivity.isDisplayed()).toBeTruthy();
      vehiclePage.goToShowHidePayActivity();
      browser.sleep(1000);
      vehiclePage.paymentActivityTransactionDetails.click();
      vehiclePage.goToClosePaymentDetails();
      browser.sleep(1000);
      vehiclePage.goToShowHidePayActivity();
    });

    it('should check for View the Title', function () {
      expect(browser.getCurrentUrl()).toContain(vehiclePage.vehicledetailsUrl);
      expect(vehiclePage.viewTitle.isDisplayed()).toBeTruthy();

      browser.driver.getAllWindowHandles().then(function (handles) {
        expect(handles.length).toEqual(1);
      });
      expect(vehiclePage.viewTitle).toBeDefined();
      vehiclePage.viewTitle.then(function (viewTitleLink) {
        viewTitleLink.click();
      });

      browser.driver.getAllWindowHandles().then(function (handles) {
        expect(handles.length).toEqual(2);
        var firstHandle = handles[0];
        var secondHandle = handles[1];
        browser.switchTo().window(secondHandle).then(function () {
          browser.executeScript('return window.location.href').then(function (url) {
            expect(url).not.toContain(vehiclePage.vehicledetailsUrl);
            browser.driver.close().then(function () {
              browser.switchTo().window(firstHandle);
            });
          });
        });
      });
    });

    it('should check for Request the Title', function () {
      expect(browser.getCurrentUrl()).toContain(vehiclePage.vehicledetailsUrl);
      expect(vehiclePage.requestTitle.isDisplayed()).toBeTruthy();
      vehiclePage.goToRequestTitle();
      browser.get(vehiclePage.vehicledetailsUrl);
    });


    var optionsbreakdown = function () {
      expect(browser.getCurrentUrl()).toContain(vehiclePage.vehicledetailsUrl);
      expect(vehiclePage.optionsAndBreak.isDisplayed()).toBeTruthy();
      vehiclePage.goToOptionsAndBreak();
      vehiclePage.goToPaymentOptions();
    };

    var changeInventory = function () {
      expect(browser.getCurrentUrl()).toContain(vehiclePage.vehicledetailsUrl);
      expect(vehiclePage.changeInventory.isDisplayed()).toBeTruthy();
      vehiclePage.goToChangeInventory();
    };

  });

});

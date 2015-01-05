/**
 * Created by gayathrimadala on 12/29/14.
 */
'use strict';

var VehiclePageObject = function () {
};

VehiclePageObject.prototype = Object.create({}, {


  // Locators
  vehicledetailsUrl: {
    value: '#/vehicledetails'
  },

  requestExtension: {
    get: function () {
      return browser.element(by.css('.paired-body a'));
    }
  },

  cancelRequest: {
    get: function () {
      return browser.element(by.css('.modal')).element(by.cssContainingText('button', 'Cancel Request'));
    }
  },

  confirmRequest: {
    get: function() {
      return browser.element(by.css('.modal')).element(by.cssContainingText('button', 'Confirm Request'));
    }
  },

  optionsAndBreak: {
    get: function() {
      return browser.element(by.css('.featured.block'));
    }
  },

  cancelChanges: {
    get: function() {
      return browser.element(by.id('cancelChanges'));
    }
  },

  confirmChanges: {
    get: function() {
      return browser.element(by.id('confirmChanges'));
    }
  },

  changeInventory: {
    get: function() {
      return browser.element(by.id('changeInvLocation'));
    }
  },

  inventoryAddress: {
    get: function() {
      return browser.element(by.model('flooringInfo.inventoryAddress'));
    }
  },

  inventoryCancel: {
    get: function() {
      return browser.element(by.css('.button-group')).element(by.cssContainingText('button', 'Cancel'));
    }
  },

  inventorySave: {
    get: function() {
      return browser.element(by.css('.button-group')).element(by.cssContainingText('button', 'Save Changes'));   //by.id('saveInvChanges'));
    }
  },

  showHidePayActivity: {
    get: function() {
      return browser.element(by.css('.accordion-button'));
    }
  },

  viewTitle: {
    get: function() {
      return browser.element(by.cssContainingText('a', 'View the Title'));
    }
  },

  requestTitle: {
    get: function() {
      return browser.element(by.cssContainingText('button', 'Request the Title'));
    }
  },

  paymentOptions: {
    get: function() {
      return browser.element(by.css('.cr-inline label'));
    }
  },

  vehicleHistory: {
    get: function() {
      return browser.element(by.css('a.featured'));
    }
  },

  closePaymentDetails: {
    get: function() {
      return browser.element(by.css('.modal')).element(by.cssContainingText('button', 'Close Window'));  //id('btnClose'));
    }
  },

  paymentActivityTransactionDetails: {
    get: function() {
      return browser.element(by.css('a.primary'));
    }
  },

  goToRequestExtension: {
    value: function () {
      this.requestExtension.click();
      browser.waitForAngular();
    }
  },

  goToCancelRequest: {
    value: function () {
      this.cancelRequest.click();
      browser.waitForAngular();
    }
  },

  goToConfirmRequest: {
    value: function () {
      this.confirmRequest.click();
      browser.waitForAngular();
    }
  },

  goToOptionsAndBreak: {
    value: function () {
      this.optionsAndBreak.click();
      browser.waitForAngular();
    }
  },

  goToCancelChanges: {
    value: function () {
      this.cancelChanges.click();
      browser.waitForAngular();
    }
  },

  goToConfirmChanges: {
    value: function () {
      this.confirmChanges.click();
      browser.waitForAngular();
    }
  },
  goToChangeInventory: {
    value: function () {
      this.changeInventory.click();
      browser.waitForAngular();
    }
  },

  goToInventoryAddress: {
    value: function () {
      this.inventoryAddress.click();
      browser.waitForAngular();
    }
  },

  goToInventoryCancel: {
    value: function () {
      this.inventoryCancel.click();
      browser.waitForAngular();
    }
  },

  goToInventorySave: {
    value: function () {
      this.inventorySave.click();
      browser.waitForAngular();
    }
  },

  goToVehicleHistory: {
    value: function () {
      this.vehicleHistory.click();
      browser.waitForAngular();
    }
  },

  goToShowHidePayActivity: {
    value: function () {
      this.showHidePayActivity.click();
      browser.waitForAngular();
    }
  },

  goToViewTitle: {
    value: function () {
      this.viewTitle.click();
      browser.waitForAngular();
    }
  },

  goToRequestTitle: {
    value: function () {
      this.requestTitle.click();
      browser.waitForAngular();
    }
  },

  goToPaymentOptions: {
    value: function () {
      this.paymentOptions.click();
      browser.waitForAngular();
    }
  },
  goToClosePaymentDetails: {
    value: function () {
      this.closePaymentDetails.click();
      browser.waitForAngular();
    }
  }

});
module.exports = VehiclePageObject;

/**
 * Created by gayathrimadala on 1/6/15.
 */

'use strict';

var FlooringVehicleObject = require('../framework/floor_vehicle_page_object');

var floorVehiclePage = new FlooringVehicleObject();

describe('Dealer Portal – Floor A Vehicle Content', function () {

  beforeEach(function () {
    browser.ignoreSynchronization = true;
    browser.get(floorVehiclePage.floorVehicleurl);
    floorVehiclePage.openPage();
  });

  it('Vehicle Information - Should contain VIN, Color, Mileage, Title Owner, and Inventory Location', function () {
    // validate elements are displayed, readable and writable
    var vinValue = 'VIN 123456';
    expect(floorVehiclePage.vinSearchField.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.getVin()).not.toEqual(vinValue);
    floorVehiclePage.setVin(vinValue);
    expect(floorVehiclePage.getVin()).toEqual(vinValue);

    var colorValue = 'Black';
    expect(floorVehiclePage.colorSelection.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.getColor()).not.toEqual(colorValue);
    floorVehiclePage.setColor(colorValue);
    expect(floorVehiclePage.getColor()).toEqual(colorValue);

    var mileageValue = 'Mileage 123456';
    expect(floorVehiclePage.mileageField.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.getMileage()).not.toEqual(mileageValue);
    floorVehiclePage.setMileage(mileageValue);
    expect(floorVehiclePage.getMileage()).toEqual(mileageValue);

    var titleLocation = 'I Have It';
    expect(floorVehiclePage.titleLocationSelection.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.getTitleLocation()).not.toEqual(titleLocation);
    floorVehiclePage.setTitleLocation(titleLocation);
    expect(floorVehiclePage.getTitleLocation()).toEqual(titleLocation);

    var inventoryLocation = '22095 392nd Ave. / Alpena SD';
    expect(floorVehiclePage.inventoryLocation.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.getInventoryLocation()).not.toEqual(inventoryLocation);
    floorVehiclePage.setInventoryLocation(inventoryLocation);
    expect(floorVehiclePage.getInventoryLocation()).toEqual(inventoryLocation);

  });

  it('Vehicle Information - Should contains Acknowledge VIN Look-Up Failure when a VIN search fails.', function () {
    var vinValue = '123456';
    expect(floorVehiclePage.vinSearchField.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
    expect(floorVehiclePage.getVin()).not.toEqual(vinValue);
    floorVehiclePage.setVin(vinValue);
    expect(floorVehiclePage.getVin()).toEqual(vinValue);
    floorVehiclePage.getVinSearchButton().then(function (vinSearchButton) {
      vinSearchButton.click();
    });
    expect(floorVehiclePage.vinAckLookupFailure.isDisplayed()).toBeTruthy();
  });

  it('Vehicle Information - Should not contains Acknowledge VIN Look-Up Failure before, when and after entering VIN.', function () {
    var vinValue = '123456';
    var otherVinValue = '0';
    expect(floorVehiclePage.vinSearchField.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
    expect(floorVehiclePage.getVin()).not.toEqual(vinValue);
    floorVehiclePage.setVin(vinValue);
    expect(floorVehiclePage.getVin()).toEqual(vinValue);
    floorVehiclePage.getVinSearchButton().then(function (vinSearchButton) {
      vinSearchButton.click();
    });
    expect(floorVehiclePage.vinAckLookupFailure.isDisplayed()).toBeTruthy();
    floorVehiclePage.setVin(otherVinValue);
    expect(floorVehiclePage.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
  });

  it('Vehicle Information - Should contain unlocked Make, Model, Year, and Style after searching invalid VIN.', function () {
    var vinValue = '123456';
    // all the outputs should not be displayed
    expect(floorVehiclePage.outputMake.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.outputModel.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.outputYear.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.outputStyle.isPresent()).not.toBeTruthy();
    // all the inputs should not be displayed as well
    expect(floorVehiclePage.inputMake.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.inputModel.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.inputYear.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.inputStyle.isPresent()).not.toBeTruthy();

    expect(floorVehiclePage.vinSearchField.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
    expect(floorVehiclePage.getVin()).not.toEqual(vinValue);
    floorVehiclePage.setVin(vinValue);
    expect(floorVehiclePage.getVin()).toEqual(vinValue);
    floorVehiclePage.getVinSearchButton().then(function (vinSearchButton) {
      vinSearchButton.click();
    });

    expect(floorVehiclePage.vinAckLookupFailure.isDisplayed()).toBeTruthy();
    // when the lookup fail, then the output should not be displayed
    expect(floorVehiclePage.outputMake.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.outputModel.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.outputYear.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.outputStyle.isPresent()).not.toBeTruthy();
    // when the lookup fail, then the inputs should be displayed
    expect(floorVehiclePage.inputMake.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.inputModel.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.inputYear.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.inputStyle.isDisplayed()).toBeTruthy();
  });

  it('Vehicle Information - Should contain locked Make, Model, Year, and Style after searching valid VIN.', function () {
    var otherVinValue = '1234567';
    // all the outputs should not be displayed
    expect(floorVehiclePage.outputMake.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.outputModel.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.outputYear.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.outputStyle.isPresent()).not.toBeTruthy();
    // all the inputs should not be displayed as well
    expect(floorVehiclePage.inputMake.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.inputModel.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.inputYear.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.inputStyle.isPresent()).not.toBeTruthy();

    expect(floorVehiclePage.vinSearchField.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
    expect(floorVehiclePage.getVin()).not.toEqual(otherVinValue);
    floorVehiclePage.setVin(otherVinValue);
    expect(floorVehiclePage.getVin()).toEqual(otherVinValue);
    floorVehiclePage.getVinSearchButton().then(function (vinSearchButton) {
      vinSearchButton.click();
    });
    // when lookup succeed, then output should be displayed but disabled for editing
    expect(floorVehiclePage.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
    expect(floorVehiclePage.outputMake.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.outputModel.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.outputYear.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.outputStyle.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.outputMake.isEnabled()).not.toBeTruthy();
    expect(floorVehiclePage.outputModel.isEnabled()).not.toBeTruthy();
    expect(floorVehiclePage.outputYear.isEnabled()).not.toBeTruthy();
    expect(floorVehiclePage.outputStyle.isEnabled()).not.toBeTruthy();
    // when the lookup fail, then the input should not be displayed
    expect(floorVehiclePage.inputMake.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.inputModel.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.inputYear.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.inputStyle.isPresent()).not.toBeTruthy();
  });

  it('Vehicle Information - Should not contain unlocked Make, Model, Year, and Style before or when entering VIN.', function () {
    var vinValue = '123456';
    var otherVinValue = '1234567';
    expect(floorVehiclePage.inputMake.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.inputModel.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.inputYear.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.inputStyle.isPresent()).not.toBeTruthy();

    expect(floorVehiclePage.vinSearchField.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
    expect(floorVehiclePage.getVin()).not.toEqual(vinValue);
    floorVehiclePage.setVin(vinValue);
    expect(floorVehiclePage.getVin()).toEqual(vinValue);
    floorVehiclePage.getVinSearchButton().then(function (vinSearchButton) {
      vinSearchButton.click();
    });

    expect(floorVehiclePage.vinAckLookupFailure.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.inputMake.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.inputModel.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.inputYear.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.inputStyle.isDisplayed()).toBeTruthy();

    // entering extra information in the vin should remove the input elements
    floorVehiclePage.setVin(otherVinValue);
    expect(floorVehiclePage.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
    expect(floorVehiclePage.inputMake.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.inputModel.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.inputYear.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.inputStyle.isPresent()).not.toBeTruthy();
  });

  it('Vehicle Information - Should not contain locked Make, Model, Year, and Style before or when entering VIN.', function () {
    var vinValue = '1234567';
    var otherVinValue = '123456';
    expect(floorVehiclePage.outputMake.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.outputModel.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.outputYear.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.outputStyle.isPresent()).not.toBeTruthy();

    expect(floorVehiclePage.vinSearchField.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
    expect(floorVehiclePage.getVin()).not.toEqual(vinValue);
    floorVehiclePage.setVin(vinValue);
    expect(floorVehiclePage.getVin()).toEqual(vinValue);
    floorVehiclePage.getVinSearchButton().then(function (vinSearchButton) {
      vinSearchButton.click();
    });

    expect(floorVehiclePage.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
    expect(floorVehiclePage.outputMake.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.outputModel.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.outputYear.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.outputStyle.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.outputMake.isEnabled()).not.toBeTruthy();
    expect(floorVehiclePage.outputModel.isEnabled()).not.toBeTruthy();
    expect(floorVehiclePage.outputYear.isEnabled()).not.toBeTruthy();
    expect(floorVehiclePage.outputStyle.isEnabled()).not.toBeTruthy();

    // entering extra information in the vin should remove the output elements
    floorVehiclePage.setVin(otherVinValue);
    expect(floorVehiclePage.vinAckLookupFailure.isDisplayed()).not.toBeTruthy();
    expect(floorVehiclePage.outputMake.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.outputModel.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.outputYear.isPresent()).not.toBeTruthy();
    expect(floorVehiclePage.outputStyle.isPresent()).not.toBeTruthy();
  });

  it('Sale Information - Should contains Buyer Search, Inventory Address, Purchase Amount, Line Of Credit, Send Payment To, and Bank Account for Disbursement.', function () {
    var buyerQuery = 'Buyer Query';
    expect(floorVehiclePage.buyerQueryField.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.getBuyerQuery()).not.toEqual(buyerQuery);
    floorVehiclePage.setBuyerQuery(buyerQuery);
    expect(floorVehiclePage.getBuyerQuery()).toEqual(buyerQuery);
    floorVehiclePage.waitAndCloseModal();

    var unitPurchasePrice = '500';
    expect(floorVehiclePage.unitPurchasePriceField.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.getUnitPurchasePrice()).not.toEqual(unitPurchasePrice);
    floorVehiclePage.setUnitPurchasePrice(unitPurchasePrice);
    expect(floorVehiclePage.getUnitPurchasePrice()).toEqual(unitPurchasePrice);
    floorVehiclePage.waitAndCloseModal();

    var unitPurchaseDate = '11/11/2014';
    expect(floorVehiclePage.unitPurchaseDateField.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.getUnitPurchaseDate()).not.toEqual(unitPurchaseDate);
    floorVehiclePage.setUnitPurchaseDate(unitPurchaseDate);
    expect(floorVehiclePage.getUnitPurchaseDate()).toEqual(unitPurchaseDate);
    floorVehiclePage.waitAndCloseModal();

    expect(floorVehiclePage.bankAccountSelection.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.inventoryLocationSelection.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.cancel.isDisplayed()).toBeTruthy();
    expect(floorVehiclePage.floorVehicle.isDisplayed()).toBeTruthy();

  });

});


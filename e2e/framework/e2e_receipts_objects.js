'use strict';


function Receipts() {

  var helper = require('../framework/e2e_helper_functions.js');
  var helper = new helper.helper();


  //Locators
  this.elReceiptsLabel = browser.element(by.css('div.search-form'));
  this.elClearSearch = browser.element(by.css('button#clearSearch.btn-unstyle.right.clear-search'));
  this.elFindFloorPlan = browser.element(by.id('keyword'));
  this.elFloorPlanSearch = browser.element(by.id('floorPlanSearch'));
  this.elPaymentMethod = browser.element(by.id('filterSelect'));
  this.elExportReceipts = browser.element.all(by.css('button[ng-click="onExport()"]'));
  this.elFirstReceipt = browser.element.all(by.css('button[ng-click="toggleInQueue(receipt)"]'));
  this.elStartDate = browser.element(by.id('startDate'));
  this.elEndDate = browser.element(by.id('endDate'));
  this.elReceipts = browser.element(by.css('table.table.table-striped.table-primary'));


  //Getters
  this.getTestClearSearch = function () {
    browser.sleep(browser.params.shortDelay);
    return this.elClearSearch.getText();
  };

  //Doers
  this.doExportReceipts = function () {
    browser.sleep(browser.params.shortDelay);
    this.elExportReceipts.get(0).click();
  };
  this.doFirstReceipt = function () {
    browser.sleep(browser.params.mediumDelay);
    this.elFirstReceipt.get(0).click();
  };
  this.doFloorPlanSearch = function () {
    this.elFloorPlanSearch.click();
    browser.sleep(browser.params.longDelay);
  };
  this.doClearSearch = function () {
    this.elClearSearch.click();
    browser.sleep(browser.params.mediumDelay);
  };
  this.doPaymentMethod = function () {
    this.doClearSearch();
    this.elPaymentMethod.click();
    browser.sleep(browser.params.shortDelay);
    this.setPaymentMethod();
    browser.sleep(browser.params.mediumDelay);
  };
  this.doDatesSearch = function () {
    this.doClearSearch();
    browser.sleep(browser.params.shortDelay);
    this.setDates();
    browser.sleep(browser.params.shortDelay);
    this.doFloorPlanSearch();
  };

  //Setters
  this.setVIN = function () {
    this.elFindFloorPlan.sendKeys('4372');
    browser.sleep(browser.params.shortDelay);
  };
  this.setPaymentMethod = function () {
    this.elPaymentMethod.sendKeys('ACH');
    browser.sleep(browser.params.shortDelay);
  };
  this.setDates = function () {
    this.elStartDate.sendKeys('03/27/2014');
    browser.sleep(browser.params.shortDelay);
    this.elEndDate.sendKeys(helper.getTodaysDate());
    browser.sleep(browser.params.shortDelay);
  };

}
module.exports.receipts = Receipts;

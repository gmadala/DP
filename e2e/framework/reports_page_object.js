/**
 * Created by gayathrimadala on 1/22/15.
 */

'use strict';

var ReportsObject = function () {

  this.url = '#/reports';

  this.currectReportsRepeater = browser.element.all(by.repeater('report in currentReports'));
  this.currentReports = browser.element(by.exactBinding('report.title'));
  this.reportsPageForm = browser.element(by.id('ReportsPage'));
  this.reportsDiv = this.reportsPageForm.all(by.repeater('report in currentReports'));   //.css('.well-item'));
  //this.currentReportsLink = this.reportsDiv.element(by.cssCo('a'));
  this.notificationsForm = browser.element(by.cssContainingText('section', 'Notifications'));

  this.curtailmentForm = browser.element(by.css('[name=curtailmentForm]'));
  this.upcomingCurtailment = this.curtailmentForm.element(by.css('.form-title'));
  this.datelabel = this.curtailmentForm.element(by.cssContainingText('label', 'Date'));
  this.dateInput = browser.element(by.id('curtailmentDate'));
  this.curtViewReportBtn = this.curtailmentForm.element(by.cssContainingText('button', 'View Report'));
  this.exportableInv = browser.element(by.cssContainingText('span', 'Exportable Inventory'));
  this.florringStatus = browser.element(by.cssContainingText('span', 'Flooring Status'));
  this.curtViewReportError = this.curtailmentForm.element(by.cssContainingText('span','Please select a Valid Date.'));

  this.expInvForm = browser.element(by.css('[name=expInvForm]'));
  this.expInvStatus = browser.element(by.id('expInvStatus'));
  this.exportableInv = browser.element(by.cssContainingText('span', 'Exportable Inventory'));
  this.florringStatus = browser.element(by.cssContainingText('span', 'Flooring Status'));
  this.expViewReoprtBtn = this.expInvForm.element(by.cssContainingText('button','View Report'));

  this.flooringStatusOptions = browser.element(by.options('o for o in data.selectData.values'));

  this.goToFlooringStatus = function () {
    browser.element(by.model('expInvStatus.value')).$('[value="0"]').click();
    browser.element(by.model('expInvStatus.value')).$('[value="1"]').click();
    browser.element(by.model('expInvStatus.value')).$('[value="2"]').click();
    browser.element(by.model('expInvStatus.value')).$('[value="3"]').click();
    browser.element(by.model('expInvStatus.value')).$('[value="4"]').click();
  };

  //Historical Reports
  this.stmtForm = browser.element(by.css('[name=stmtForm]'));
  this.historicalReportsTitle =  browser.element(by.cssContainingText('span','Historical Reports'));
  this.dealerStatement = this.stmtForm.element(by.css('.form-title'));
  this.startDateLabel = this.stmtForm.element(by.css('.range-start'));
  this.startDateInput = browser.element(by.id('stmtStart'));
  this.startDateError = this.stmtForm.element(by.cssContainingText('span','Please select a Valid Start Date.'));
  this.endDateLabel = this.stmtForm.element(by.css('.range-end'));
  this.endDateInput = browser.element(by.id('stmtEnd'));
  this.endDateError = this.stmtForm.element(by.cssContainingText('span','Please select a Valid End Date.'));
  this.filterVINLabel = this.stmtForm.element(by.cssContainingText('span', 'Filter for VIN (optional)'));
  this.filterVINInput = browser.element(by.id('stmtVinFilter'));
  this.hisRepViewReport = this.stmtForm.element(by.cssContainingText('button','View Report'));

  //Disbursement Detail
  this.disForm = browser.element(by.css('[name=disForm]'));
  this.disbursementDetailTitle =  browser.element(by.cssContainingText('span','Disbursement Detail'));
  this.disDateLabel = this.disForm.element(by.cssContainingText('label','Date'));
  this.disDateInput = browser.element(by.id('disDate'));
  this.disDateError = this.disForm.element(by.cssContainingText('span','Please select a Valid Date.'));
  this.disRepViewReport = this.disForm.element(by.cssContainingText('button','View Report'));

  //Paid Off Summary
  this.paidOffForm = browser.element(by.css('[name=paidOffForm]'));
  this.paidStartDateLabel = this.paidOffForm.element(by.css('.range-start'));
  this.paidStartDateInput = browser.element(by.id('paidOffStart'));
  this.paidStartDateError = this.paidOffForm.element(by.cssContainingText('span','Please select a Valid Start Date.'));
  this.paidEndDateLabel = this.paidOffForm.element(by.css('.range-end'));
  this.paidEndDateInput = browser.element(by.id('paidOffEnd'));
  this.paidEndDateError = this.paidOffForm.element(by.cssContainingText('span','Please select a Valid End Date.'));
  this.paidFilterVINLabel = this.paidOffForm.element(by.cssContainingText('span', 'Filter for VIN (optional)'));
  this.paidFilterVINInput = browser.element(by.id('paidOffVinFilter'));
  this.paidStockVINLabel = this.paidOffForm.element(by.cssContainingText('span', 'Stock Number Filter (optional)'));
  this.paidStockVINSelect = browser.element(by.id('paidOffStockNo'));
  this.paidRepViewReport = this.paidOffForm.element(by.cssContainingText('button','View Report'));

  this.goToStockNumberVIN = function () {
    browser.element(by.model('data.selectData.value')).$('[value="0"]').click();
    browser.element(by.model('data.selectData.value')).$('[value="1"]').click();
    browser.element(by.model('data.selectData.value')).$('[value="2"]').click();
    browser.element(by.model('data.selectData.value')).$('[value="3"]').click();
    browser.element(by.model('data.selectData.value')).$('[value="4"]').click();
  };

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

  this.getCurrentDate = function(){
    return this.dateInput.getAttribute('value');
  },

  this.getStartCurrentDate = function(){
    return this.startDateInput.getAttribute('value');
  },

  this.getEndCurrentDate = function(){
    return this.endDateInput.getAttribute('value');
  },
  this.getDisbursementDate = function(){
    return this.disDateInput.getAttribute('value');
  },
  this.getPaidStartDate = function(){
    return this.paidStartDateInput.getAttribute('value');
  },
  this.getPaidEndDate = function(){
    return this.paidEndDateInput.getAttribute('value');
  }
};
module.exports = ReportsObject;



/**
 * Created by gayathrimadala on 1/22/15.
 */

'use strict';

var ReportsObject = require('../framework/reports_page_object.js');
var DatePickerObject = require('../framework/datepicker_page_object');

var reportsPage = new ReportsObject();
var datePickerObject = new DatePickerObject();


describe('Dealer Portal – Reports', function () {
  beforeEach(function () {
    reportsPage.openPage();
    //browser.sleep(5000);
  });

  it('should check for the click on the Current Reports', function() {
    expect(reportsPage.currentReports.isDisplayed()).toBeTruthy();

    /* //Needs to be completed
     browser.driver.getAllWindowHandles().then(function (handles) {
     expect(handles.length).toEqual(1);
     });
     var link = reportsPage.reportsDiv.first().element(by.css('a'));
     //console.log('AAA',link);
     browser.driver.actions().click(link).perform();
     link.click();
     browser.sleep(3000);

     // reportsPage.currentReportsLink.click();
     browser.driver.getAllWindowHandles().then(function (handles) {
     console.log('handles.length', handles.length);
     expect(handles.length).toEqual(2);
     var firstHandle = handles[0];
     var secondHandle = handles[1];
     browser.driver.switchTo().window(secondHandle).then(function () {
     browser.driver.executeScript('return window.location.href').then(function (url) {
     expect(url).not.toContain(reportsPage.url);
     browser.driver.close().then(function () {
     browser.driver.switchTo().window(firstHandle);
     });
     });
     });
     });*/
  });

  it('should check for the Current Reports - Upcoming Curtailment/Payoff Quote (PDF) - With Date', function(){
    var date = '10/12/2010';
    currentReportsFields();
    expect(reportsPage.upcomingCurtailment.isDisplayed()).toBeTruthy();
    expect(reportsPage.datelabel.isDisplayed()).toBeTruthy();
    expect(reportsPage.dateInput.isDisplayed()).toBeTruthy();
    reportsPage.dateInput.click();
    expect(datePickerObject.datepicker.isDisplayed()).toBeTruthy();
    datePickerObject.setDate(12, 'Oct', 2010);
    expect(reportsPage.getCurrentDate()).toEqual(date);

    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(1);
    });
    expect(browser.driver.getCurrentUrl()).toContain(reportsPage.url);
    reportsPage.curtViewReportBtn.click();
    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(2);
      var firstHandle = handles[0];
      var secondHandle = handles[1];
      browser.driver.switchTo().window(secondHandle).then(function () {
        browser.driver.executeScript('return window.location.href').then(function (url) {
          expect(url).not.toContain(reportsPage.url);
          browser.driver.close().then(function () {
            browser.driver.switchTo().window(firstHandle);
          });
        });
      });
    });

  });

  it('should check for the Current Reports - Upcoming Curtailment- View Report without Date', function(){
    expect(reportsPage.curtViewReportBtn.isDisplayed()).toBeTruthy();
    reportsPage.curtViewReportBtn.click();
    expect(reportsPage.curtViewReportError.isDisplayed()).toBeTruthy();
    currentReportsFields();
  });

  it('should check for the Current Reports - Exportable Inventory', function(){
    currentReportsFields();
    reportsPage.goToFlooringStatus();
    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(1);
    });
    expect(browser.driver.getCurrentUrl()).toContain(reportsPage.url);
    reportsPage.expViewReoprtBtn.click();
    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(2);
      var firstHandle = handles[0];
      var secondHandle = handles[1];
      browser.driver.switchTo().window(secondHandle).then(function () {
        browser.driver.executeScript('return window.location.href').then(function (url) {
          expect(url).not.toContain(reportsPage.url);
          browser.driver.close().then(function () {
            browser.driver.switchTo().window(firstHandle);
          });
        });
      });
    });
  });

  it('should check for the Historical Reports - Dealer Statement. - without start date and endd ate', function(){
    historicalReportsFields();
    reportsPage.hisRepViewReport.click();
    expect(reportsPage.startDateError.isDisplayed()).toBeTruthy();
    expect(reportsPage.endDateError.isDisplayed()).toBeTruthy();
    browser.sleep(5000);
  });

  it('should check for the Historical Reports - Dealer Statement. - with start date and end date', function(){
    var date = '01/10/2010';
    var enddate = '10/12/2010';
    historicalReportsFields();

    reportsPage.startDateInput.click();
    expect(datePickerObject.datepicker.isDisplayed()).toBeTruthy();
    datePickerObject.setDate(10, 'Jan', 2010);
    expect(reportsPage.getStartCurrentDate()).toEqual(date);

    reportsPage.endDateInput.click();
    expect(datePickerObject.datepicker.isDisplayed()).toBeTruthy();
    datePickerObject.setDate(12, 'Oct', 2010);
    expect(reportsPage.getEndCurrentDate()).toEqual(enddate);

    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(1);
    });
    expect(browser.driver.getCurrentUrl()).toContain(reportsPage.url);
    reportsPage.hisRepViewReport.click();
    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(2);
      var firstHandle = handles[0];
      var secondHandle = handles[1];
      browser.driver.switchTo().window(secondHandle).then(function () {
        browser.driver.executeScript('return window.location.href').then(function (url) {
          expect(url).not.toContain(reportsPage.url);
          browser.driver.close().then(function () {
            browser.driver.switchTo().window(firstHandle);
          });
        });
      });
    });
    expect(reportsPage.startDateError.isDisplayed()).not.toBeTruthy();
    expect(reportsPage.endDateError.isDisplayed()).not.toBeTruthy();
  });

  it('should check for the Historical Reports - Dealer Statement. - without start date and end date', function(){
    historicalReportsFields();
    reportsPage.hisRepViewReport.click();
    expect(reportsPage.startDateError.isDisplayed()).toBeTruthy();
    expect(reportsPage.endDateError.isDisplayed()).toBeTruthy();
  });

  it('should check for the Historical Reports - Disbursement Detail - with Date', function(){
    var disDate = '10/14/2010';
    expect(reportsPage.disbursementDetailTitle.isDisplayed()).toBeTruthy();
    expect(reportsPage.disDateLabel.isDisplayed()).toBeTruthy();
    expect(reportsPage.disDateInput.isDisplayed()).toBeTruthy();
    reportsPage.disDateInput.click();

    expect(datePickerObject.datepicker.isDisplayed()).toBeTruthy();
    datePickerObject.setDate(14, 'Oct', 2010);
    expect(reportsPage.getDisbursementDate()).toEqual(disDate);

    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(1);
    });
    expect(browser.driver.getCurrentUrl()).toContain(reportsPage.url);
    reportsPage.disRepViewReport.click();
    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(2);
      var firstHandle = handles[0];
      var secondHandle = handles[1];
      browser.driver.switchTo().window(secondHandle).then(function () {
        browser.driver.executeScript('return window.location.href').then(function (url) {
          expect(url).not.toContain(reportsPage.url);
          browser.driver.close().then(function () {
            browser.driver.switchTo().window(firstHandle);
          });
        });
      });
    });
    expect(reportsPage.disDateError.isDisplayed()).not.toBeTruthy();
  });

  it('should check for the Historical Reports - Disbursement Detail - without Date', function(){
    expect(reportsPage.disbursementDetailTitle.isDisplayed()).toBeTruthy();
    expect(reportsPage.disDateLabel.isDisplayed()).toBeTruthy();
    expect(reportsPage.disDateInput.isDisplayed()).toBeTruthy();
    reportsPage.disDateInput.click();
    reportsPage.disRepViewReport.click();
    expect(reportsPage.disDateError.isDisplayed()).toBeTruthy();
  });

  it('should check for the Historical Reports - paid off summary - without Date', function(){
    paidOffSummaryFields();
    reportsPage.paidRepViewReport.click();
    expect(reportsPage.paidStartDateError.isDisplayed()).toBeTruthy();
    expect(reportsPage.paidEndDateError.isDisplayed()).toBeTruthy();
  });

  it('should check for the Historical Reports - paid off summary - with Date', function(){
    var paidStartDate = '01/10/2010';
    var paidEndDate = '10/12/2010';

    reportsPage.paidStartDateInput.click();
    expect(datePickerObject.datepicker.isDisplayed()).toBeTruthy();
    datePickerObject.setDate(10, 'Jan', 2010);
    expect(reportsPage.getPaidStartDate()).toEqual(paidStartDate);

    reportsPage.paidEndDateInput.click();
    expect(datePickerObject.datepicker.isDisplayed()).toBeTruthy();
    datePickerObject.setDate(12, 'Oct', 2010);
    expect(reportsPage.getPaidEndDate()).toEqual(paidEndDate);

    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(1);
    });
    expect(browser.driver.getCurrentUrl()).toContain(reportsPage.url);
    reportsPage.paidRepViewReport.click();
    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(2);
      var firstHandle = handles[0];
      var secondHandle = handles[1];
      browser.driver.switchTo().window(secondHandle).then(function () {
        browser.driver.executeScript('return window.location.href').then(function (url) {
          expect(url).not.toContain(reportsPage.url);
          browser.driver.close().then(function () {
            browser.driver.switchTo().window(firstHandle);
          });
        });
      });
    });
    expect(reportsPage.paidStartDateError.isDisplayed()).not.toBeTruthy();
    expect(reportsPage.paidEndDateError.isDisplayed()).not.toBeTruthy();
  });

  var currentReportsFields = function(){
    expect(reportsPage.exportableInv.isDisplayed()).toBeTruthy();
    expect(reportsPage.florringStatus.isDisplayed()).toBeTruthy();
    expect(reportsPage.exportableInv.isDisplayed()).toBeTruthy();
    expect(reportsPage.expViewReoprtBtn.isDisplayed()).toBeTruthy();
  };

  var historicalReportsFields = function(){
    expect(reportsPage.historicalReportsTitle.isDisplayed()).toBeTruthy();
    expect(reportsPage.dealerStatement.isDisplayed()).toBeTruthy();
    expect(reportsPage.startDateLabel.isDisplayed()).toBeTruthy();
    expect(reportsPage.startDateInput.isDisplayed()).toBeTruthy();
    expect(reportsPage.endDateLabel.isDisplayed()).toBeTruthy();
    expect(reportsPage.endDateInput.isDisplayed()).toBeTruthy();
    expect(reportsPage.filterVINLabel.isDisplayed()).toBeTruthy();
    expect(reportsPage.filterVINInput.isDisplayed()).toBeTruthy();
  };

  var paidOffSummaryFields = function() {
    expect(reportsPage.paidStartDateLabel.isDisplayed()).toBeTruthy();
    expect(reportsPage.paidStartDateInput.isDisplayed()).toBeTruthy();
    expect(reportsPage.paidEndDateLabel.isDisplayed()).toBeTruthy();
    expect(reportsPage.paidEndDateInput.isDisplayed()).toBeTruthy();
    expect(reportsPage.paidFilterVINLabel.isDisplayed()).toBeTruthy();
    expect(reportsPage.paidFilterVINInput.isDisplayed()).toBeTruthy();
    expect(reportsPage.paidStockVINLabel.isDisplayed()).toBeTruthy();
    expect(reportsPage.paidStockVINSelect.isDisplayed()).toBeTruthy();
    expect(reportsPage.paidRepViewReport.isDisplayed()).toBeTruthy();
  };

});



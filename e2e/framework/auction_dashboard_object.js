'use strict';

var AuctionDashboardObject = function () {

  this.url = '#/act/home';

  this.previousDisbursementsLink = browser.element(by.cssContainingText('button', 'Previous Disbursements'));
  // dashboard top contents
  this.dashboardContents = browser.element.all(by.css('.auction-well'));

  this.paidAwaitingTitle = browser.element(by.exactBinding('dashboardData.PaidAwaitingTitleDisbursement'));
  this.paidAwaitingTitleTotal = browser.element(by.exactBinding('dashboardData.PaidAwaitingTitleDisbursementTotal'));

  this.paidDisbursements = browser.element(by.exactBinding('dashboardData.PaidDisbursements'));
  this.paidDisbursementTotal = browser.element(by.exactBinding('dashboardData.PaidDisbursementTotal'));

  this.pendingDisbursements = browser.element(by.exactBinding('dashboardData.PendingDisbursements'));
  this.pendingDisbursementTotal = browser.element(by.exactBinding('dashboardData.PendingDisbursementTotal'));

  this.approvedFloorplans = browser.element(by.exactBinding('dashboardData.ApprovedFloorplans'));
  this.approvedFloorplanAmount = browser.element(by.exactBinding('dashboardData.ApprovedFloorplanOutstandingAmount'));

  this.awaitingTitleZeroToFifteenDays = browser.element(by.exactBinding('dashboardData.AwaitingTitleZeroToFifteenDays'));
  this.awaitingTitleZeroToFifteenDaysAmount = browser.element(by.exactBinding('dashboardData.AwaitingTitleZeroToFifteenDaysAmount'));

  this.awaitingTitleSixteenToThirtyDays = browser.element(by.exactBinding('dashboardData.AwaitingTitleSixteenToThirtyDays'));
  this.awaitingTitleSixteenToThirtyDaysAmount = browser.element(by.exactBinding('dashboardData.AwaitingTitleSixteenToThirtyDaysAmount'));

  this.awaitingTitleOverThirtyDays = browser.element(by.exactBinding('dashboardData.AwaitingTitleOverThirtyDays'));
  this.awaitingTitleOverThirtyDaysAmount = browser.element(by.exactBinding('dashboardData.AwaitingTitleOverThirtyDaysAmount'));

  this.pendingFloorplans = browser.element(by.exactBinding('dashboardData.PendingFloorplans'));
  this.pendingFloorplansAmount = browser.element(by.exactBinding('dashboardData.PendingFloorplansOutstandingAmount'));

  this.disbursements = browser.element.all(by.repeater('dis in dashboardData.Disbursements'));
  this.disbursementsDate = browser.element.all(by.repeater('dis in dashboardData.Disbursements').column('dis.DisbursementDate'));
  this.disbursementsNo = browser.element.all(by.repeater('dis in dashboardData.Disbursements').column('dis.DisbursementNumber'));
  this.disbursementsAmount = browser.element.all(by.repeater('dis in dashboardData.Disbursements').column('dis.DisbursementAmount'));

  this.slider = browser.element(by.css('.auction-dashboard-chart')).element(by.css('.btn-slider'));
  this.buttonYear = browser.element(by.cssContainingText('button', 'Year'));
  this.buttonMonth = browser.element(by.cssContainingText('button', 'Month'));
  this.buttonWeek = browser.element(by.cssContainingText('button', 'Week'));

  this.chartObject = browser.element(by.css('.chart-obj'));
  this.chartObjectAxisLabels = browser.element.all(by.css('.highcharts-axis-labels'));

  this.openPage = function () {
    browser.get(this.url);
  };

  this.waitForPage = function () {
    var previousDisbursementsLink = this.previousDisbursementsLink;
    browser.driver.wait(function () {
      return previousDisbursementsLink.isDisplayed();
    }, 3000);
  };

  this.getDashboardContent = function (header) {
    var promise = protractor.promise.defer();
    this.dashboardContents.each(function (dashboardContent) {
      var contentHeader = dashboardContent.element(by.css('h2'));
      contentHeader.getText().then(function (text) {
        if (text.toLowerCase() === header.toLowerCase()) {
          promise.fulfill(dashboardContent);
        }
      });
    });
    return promise;
  };

  this.getXAxisLabel = function () {
    var promise = protractor.promise.defer();
    var regex = /^\d+$/;
    // we have two chart axis label, the x axis and the y axis
    this.chartObjectAxisLabels.each(function (axisLabel) {
      var textLabels = axisLabel.all(by.css('tspan'));
      textLabels.each(function (textLabel) {
        textLabel.getText().then(function (text) {
          if (!regex.test(text)) {
            promise.fulfill(axisLabel);
          }
        });
      });
    });
    return promise;
  };
};

module.exports = AuctionDashboardObject;

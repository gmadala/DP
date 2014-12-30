/**
 * Created by gayathrimadala on 12/29/14.
 */
'use strict';

var HomePageObject = require('../framework/home_page_object.js');
var UtilObject = require('../framework/util_object.js');
var ErrorObject = require('../framework/error_page_object.js');

var homePage = new HomePageObject();
var util = new UtilObject();
var err = new ErrorObject();

//Home Page
describe ('Dealer Portal Home Page', function() {

  beforeEach(function () {
    browser.ignoreSynchronization = true;
    browser.get(homePage.homeUrl);
  });
  //Navigate to all links in the Home Page
  it('should navigate to all links in the Home page', function () {
    expect(homePage.lnkPayments.isDisplayed()).toBeTruthy();
    expect(homePage.lnkFloorPlan.isDisplayed()).toBeTruthy();
    expect(homePage.lnkTilteReleases.isDisplayed()).toBeTruthy();
    expect(homePage.lnkReceipts.isDisplayed()).toBeTruthy();
    expect(homePage.lnkReports.isDisplayed()).toBeTruthy();
    expect(homePage.lnkAnalytics.isDisplayed()).toBeTruthy();
    homePage.goToPayments();
    homePage.goToFloorPlan();
    homePage.goToTitleReleases();
    homePage.goToReceipts();
    homePage.goToReports();
    homePage.goToTitleAnalytics();
  });

  //Dashboard Navigation
  it('Navigation in the Dashboard', function () {
    expect(homePage.lnkDashboard.isDisplayed()).toBeTruthy();
    expect(homePage.btnMonth.isDisplayed()).toBeTruthy();
    expect(homePage.btnWeek.isDisplayed()).toBeTruthy();
    expect(homePage.nextArrow.isDisplayed()).toBeTruthy();
    expect(homePage.prevArrow.isDisplayed()).toBeTruthy();
    expect(homePage.showPaymentDetails.isDisplayed()).toBeTruthy();
    homePage.goToPayments();
    homePage.goToDashboard();
    homePage.goToMonth();
    homePage.goToWeek();
    homePage.goToNextArrow();
    homePage.goToPrevArrow();
    homePage.goToShowPaymentDetails();
    homePage.goToVehicleDetails();
    homePage.goToShowPaymentDetails();
    browser.sleep(1000);
    homePage.goToPaymentSummary();
    homePage.goToCreditInformation();
    homePage.goToSelectDropdownbyNum();
    homePage.goToRequestCreditIncrease();
    homePage.goToCancelRequest();
  });

  it('should check for Request credit Increase', function () {
    homePage.goToRequestCreditIncrease();
    homePage.goToConfirmRequest();
    expect(err.lineOfCreditError).toBeTruthy();
    expect(err.tempOrPermanent).toBeTruthy();
    expect(err.increaseAmount).toBeTruthy();
    expect(homePage.lineOfCreditOptions.count()).toBeGreaterThan(1);
    homePage.goToLineOfCredit();
    homePage.goToIsNotTemporary();
    homePage.doSelectAmount();
    homePage.goToConfirmRequest();
    util.goToOKButton();
  });

  it('should check for the View all Receipts:', function () {
    homePage.goToViewAllReceipts();
  });

  it('should check for the View all Receipts:', function () {
    homePage.goToViewAllReceipts();
  });

  it('should check for the Request Payout:', function () {
    homePage.goToRequestPayout();
    homePage.goToRequestPayoutSubmit();
    expect(err.payOutAmountError).toBeTruthy();
    homePage.doSetPayOutAmt();
    homePage.goToRequestPayoutSubmit();
    util.goToOKButton();
  });


  describe('checking Floor Plan', function () {
    beforeEach(function () {
      browser.ignoreSynchronization = true;
      homePage.goToDashboard();
    });
    it('should check for the Floor Plan Approved:', function () {
      homePage.goToFPApproved();
    });
    it('should check for the Floor Plan Pending:', function () {
      homePage.goToFPPending();
    });
    it('should check for the Floor Plan Denied:', function () {
      homePage.goToFPDenied();
    });
    it('should check for the Floor Plan:', function () {
      homePage.goToFloorPlanBtn();
    });
  });

  it('should check for the recently floored vehicles', function () {
    homePage.goToFlooredVehicleDetails();
  });

});

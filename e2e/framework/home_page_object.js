'use strict';

var HomePageObject = function () {
};

HomePageObject.prototype = Object.create({}, {


  // Locators
  homeUrl: {
    value: '#/home'
  },

  dashboardUrl: {value: '#/dashboard.html'},

  lnkDashboard: {
    get: function () {

      return browser.element(by.css('.link_dashboard'));
    }
  },
  lnkPayments: {
    get: function () {

      return browser.element(by.css('.link_payments'));
    }
  },

  lnkFloorPlan: {
    get: function () {
      return browser.element(by.css('.link_floorplan'));
    }
  },

  lnkTilteReleases: {
    get: function () {
      return browser.element(by.css('.link_titlereleases'));
    }
  },

  lnkReceipts: {
    get: function () {
      return browser.element(by.css('.link_receipts'));
    }
  },

  lnkReports: {
    get: function () {
      return browser.element(by.css('.link_reports'));
    }
  },
  flooredVehiclesLinks: {
    get: function () {
      return browser.element.all(by.css('.table-value a'));
    }
  },
  lnkAnalytics: {
    get: function () {
      return browser.element(by.css('.link_analytics'));
    }
  },
  btnWeek: {
    get: function () {
      var calendarHeader = browser.element(by.css('.dash-calendar-header'));
      return calendarHeader.element(by.cssContainingText('button', 'Week'));
    }
  },

  requestCreditIncrease: {
    get: function () {
      return browser.element(by.cssContainingText('button', 'Request Credit Increase'));
    }
  },

  cancelRequest: {
    get: function () {
      var modal = browser.element(by.css('.modal'));
      return modal.element(by.cssContainingText('button', 'Cancel Request'));
    }
  },

  confirmRequest: {
    get: function () {
      var modal = browser.element(by.css('.modal'));
      return modal.element(by.cssContainingText('button', 'Confirm Request'));
    }
  },

  lineOfCredit: {
    get: function () {
      //return browser.element(by.model("$parent.selector.selectedLineOfCredit"));
      return browser.element(by.id('lineOfCredit2'));
    }
  },
  lineOfCreditOptions: {
    get: function () {
      return browser.element.all(by.options('loc.CreditTypeName for loc in dashboardData.LinesOfCredit'));
    }
  },
  isNotTemporary: {
    get: function () {
      return browser.element(by.id('isTemp'));
    }
  },

  selectAmount: {
    get: function () {
      return browser.element(by.model('selector.amount'));
    }
  },

  btnMonth: {
    get: function () {
      return browser.element(by.id('month'));
    }
  },

  nextArrow: {
    get: function () {
      var tableHeader = browser.element(by.css('.dash-calendar'));
      return tableHeader.element(by.css('.fc-button-next'));
    }
  },

  prevArrow: {
    get: function () {
      var tableHeader = browser.element(by.css('.dash-calendar'));
      return tableHeader.element(by.css('.fc-button-prev'));
    }
  },

  showPaymentDetails: {
    get: function () {
      return browser.element(by.id('showorhide'));
    }
  },

  signOutButton: {
    get: function () {
      return browser.element(by.cssContainingText('a', 'Sign Out'));
    }
  },

  menuDropdown: {
    get: function () {
      return browser.element(by.css('.nxg-dropdown'));
    }
  },

  //ViewAllReceipts
  viewAllReceipts: {
    get: function () {
      return browser.element(by.id('viewAllReceipts'));
    }
  },

  //RequestPayout
  requestPayout: {
    get: function () {
      return browser.element(by.id('requestPayout'));
    }
  },

  payOutAmt: {
    get: function () {
      return browser.element(by.id('payoutAmt'));
    }
  },

  reqPayoutSubmit: {
    get: function () {
      return browser.element(by.id('reqPayoutSubmit'));
    }
  },

  //FloorPlan
  fpApproved: {
    get: function () {
      return browser.element(by.id('fpApproved'));
    }
  },
  fpPending: {
    get: function () {
      return browser.element(by.id('fpPending'));
    }
  },
  fpDenied: {
    get: function () {
      return browser.element(by.id('fpDenied'));
    }
  },
  floorPlanBtn: {
    get: function () {
      return browser.element(by.id('floorPlan'));
    }
  },
  //Setters
  setSelectAmount: {
    value: function () {
      this.selectAmount.sendKeys('100');
      browser.waitForAngular();
    }
  },

  setPayOutAmt: {
    value: function () {
      this.payOutAmt.sendKeys('100');
      browser.waitForAngular();
    }
  },

  //Doers
  doSelectAmount: {
    value: function () {
      this.setSelectAmount();
      browser.waitForAngular();
    }
  },
  doSetPayOutAmt: {
    value: function () {
      this.setPayOutAmt();
      browser.waitForAngular();
    }
  },

  //Navigation
  goToSignOut: {
    value: function () {
      this.signOutButton.click();
      browser.waitForAngular();
    }
  },
  goToHome: {
    value: function () {
      this.homeUrl.click();
    }
  },
  goToMenuDropdown: {
    value: function () {
      this.menuDropdown.click();
    }
  },
  goToDashboard: {
    value: function () {
      this.lnkDashboard.click();
    }
  },
  goToPayments: {
    value: function () {
      this.lnkPayments.click();
    }
  },
  goToFloorPlan: {
    value: function () {
      this.lnkFloorPlan.click();
    }
  },
  goToTitleReleases: {
    value: function () {
      this.lnkTilteReleases.click();
    }
  },
  goToReceipts: {
    value: function () {
      this.lnkReceipts.click();
    }
  },
  goToReports: {
    value: function () {
      this.lnkReports.click();
    }
  },
  goToTitleAnalytics: {
    value: function () {
      this.lnkAnalytics.click();
    }
  },
  goToWeek: {
    value: function () {
      this.btnWeek.click();
    }
  },
  goToMonth: {
    value: function () {
      this.btnMonth.click();
    }
  },
  goToNextArrow: {
    value: function () {
      this.nextArrow.click();
    }
  },
  goToPrevArrow: {
    value: function () {
      this.prevArrow.click();
    }
  },
  goToShowPaymentDetails: {
    value: function () {
      this.showPaymentDetails.click();
    }
  },

  goToVehicleDetails: {
    value: function () {
      browser.element.all(by.repeater('payment in dashboardData.UpcomingPaymentsList')).then(function (data) {
        for (var i = 1; i <= data.length; i++) {
          browser.element(by.id('stockNumber' + i)).click();
          browser.get('#/home');
          browser.element(by.id('showorhide')).click();
        }
      });
    }
  },

  goToPaymentSummary: {
    value: function () {
      browser.element(by.id('overdue')).click();
      browser.get(this.homeUrl);
      browser.element(by.id('today')).click();
      browser.get(this.homeUrl);
      this.btnWeek.click();
      browser.get(this.homeUrl);
      browser.sleep(1000);
      browser.element(by.id('fees')).click();
      browser.get(this.homeUrl);
      browser.element(by.cssContainingText('button', 'View All Payments')).click();
      browser.get(this.homeUrl);

    }
  },

  goToCreditInformation: {
    value: function () {
      browser.findElements(protractor.By.css('#lineOfCredit > option')).then(function (loc) {
        expect(loc.length).toBe(3);
      });
    }
  },

  goToSelectDropdownbyNum: {
    value: function () {
      browser.element(by.model('dashboardData.selectedLineOfCredit')).$('[value="0"]').click();
      browser.element(by.model('dashboardData.selectedLineOfCredit')).$('[value="1"]').click();
      browser.element(by.model('dashboardData.selectedLineOfCredit')).$('[value="2"]').click();
    }
  },

  goToRequestCreditIncrease: {
    value: function () {
      this.requestCreditIncrease.click();
    }
  },

  goToCancelRequest: {
    value: function () {
      this.cancelRequest.click();
    }
  },

  goToConfirmRequest: {
    value: function () {
      this.confirmRequest.click();
    }
  },

  goToLineOfCredit: {
    value: function () {
      browser.driver.actions().click(this.lineOfCredit).perform();
    }
  },

  goToIsNotTemporary: {
    value: function () {
      browser.driver.actions().click(this.isNotTemporary).perform();
    }
  },

  goToViewAllReceipts: {
    value: function () {
      this.viewAllReceipts.click();
    }
  },

  goToRequestPayout: {
    value: function () {
      this.requestPayout.click();
    }
  },

  goToRequestPayoutSubmit: {
    value: function () {
      this.reqPayoutSubmit.click();
    }
  },

  goToFPApproved: {
    value: function () {
      this.fpApproved.click();
    }
  },

  goToFPPending: {
    value: function () {
      this.fpPending.click();
    }
  },

  goToFPDenied: {
    value: function () {
      this.fpDenied.click();
    }
  },

  goToFloorPlanBtn: {
    value: function () {
      this.floorPlanBtn.click();
    }
  },

  goToFlooredVehicleDetails: {
    value: function () {
      var promise = protractor.promise.defer();
      this.flooredVehiclesLinks.each(function (floorPlanLink) {
        promise.fulfill(floorPlanLink);
      });
      return promise;
    }
  }
});
module.exports = HomePageObject;

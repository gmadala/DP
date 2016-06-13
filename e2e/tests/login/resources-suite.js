'use strict';

// var loginRecover = require('../../framework/login-recover-objects.js');
var login = require('../../framework/login.js');
var dashboard = require('../../framework/dashboard-objects.js');
var resources = require('../../framework/resources-objects');
var execSettings = require('../../framework/e2e_execSettings.js');
var newWindowHandle;
var resourcesLink = new resources.resources();
describe("Log In Suite  \n ", function() {

  beforeEach(function() {
    browser.sleep(browser.params.shortDelay);
    browser.driver.manage().window().maximize();
    browser.ignoreSynchronization = true;
    browser.get(execSettings.loginPage());
    //Login and go to request credit increase
    login.login2(browser.params.userName, browser.params.password);
    expect(browser.getCurrentUrl() === execSettings.homePage());
    dashboard.clickResources();
    expect(browser.getCurrentUrl() === execSettings.resourcesPage());
  });

  it("1. As a dealer I want to view rates in fees in resources", function() {
    resourcesLink.doRatesAndFees();
    browser.getAllWindowHandles().then(function (handles) {
      newWindowHandle = handles[1];
      browser.switchTo().window(newWindowHandle).then(function () {
        expect(browser.getCurrentUrl()).toEqual('https://test.nextgearcapital.com/MobileService/api/dealer/feeschedule/FeeSchedule?AuthToken=61DF5855-0839-499E-B04C-AC08CA6AD2F3');
      });
    });
  });
  it("2. As a dealer I want to view welcome packet", function() {
    resourcesLink.doWelcomePacket();
    resources.checkNewTab('http://www.nextgearcapital.com/welcome-packet/');
  });
  it("3. As a dealer I want to view dealer funding checklist", function() {
    resourcesLink.doDealerFunding();
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Dealer%20Funding%20Checklist.pdf');
  });
  it("4. As a dealer I want to view Title Management Frequently Asked Questions", function() {
    resourcesLink.doTitleManagement();
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Records%20Title%20FAQ.pdf');
  });
  it("5. As a dealer I want to view instructions for buyers", function() {
    resourcesLink.doInstructionsForBuyers();
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/NextGear%20Capital%20Website%20Guide%20-%20Buyers.pdf');
  });
  it("6. As a dealer I want to view welcome letter", function() {
    resourcesLink.doWelcomeLetter();
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Welcome%20Letter.pdf');
  });
  it("7. As a dealer I want to view guidelines", function() {
    resourcesLink.doGuidelines();
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Insurance%20Guidelines.pdf');
  });
  it("8. As a dealer I want to view information sheet", function() {
    resourcesLink.doInformationSheet();
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Information%20Sheet.pdf');
  });
  it("9. As a dealer I want to view claim form", function() {
    resourcesLink.doClaimForm();
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Claim%20Form.pdf');
  });
  it("10. As a dealer I want to download IOS app", function() {
    resourcesLink.doMobileIOS();
    resources.checkNewTab('https://itunes.apple.com/us/app/nextgear-capital/id748609885?mt=8');
  });
  it("11. As a dealer I want to download android app", function() {
    resourcesLink.doMobileAndroid();
    resources.checkNewTab('https://play.google.com/store/apps/details?id=com.nextgear.mobile');
  });

});

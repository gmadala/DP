'use strict';

// var loginRecover = require('../../framework/login-recover-objects.js');
var login = require('../../framework/login.js');
var dashboard = require('../../framework/dashboard-objects.js');
var resources = require('../../framework/resources-objects');
var homepageUrl = "https://test.nextgearcapital.com/test/#/login";
describe("Log In Suite  \n ", function() {

  beforeEach(function() {
    browser.sleep(browser.params.shortDelay);
    browser.driver.manage().window().maximize();
    browser.get(homepageUrl);
    browser.ignoreSynchronization = true;
    //Login and go to request credit increase
    login.login2(browser.params.userName, browser.params.password);
    dashboard.clickResources();
  });

  it("1. As a dealer I want to view rates in fees in resources", function() {
    resources.clickRatesAndFees();
    resources.checkNewTab('https://test.nextgearcapital.com/MobileService/api/dealer/feeschedule/FeeSchedule?AuthToken');
  });
  it("2. As a dealer I want to view welcome packet", function() {
    resources.clickWelcomePacket();
    resources.checkNewTab('http://www.nextgearcapital.com/welcome-packet/');
  });
  it("3. As a dealer I want to view dealer funding checklist", function() {
    resources.clickDealerFunding();
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Dealer%20Funding%20Checklist.pdf');
  });
  it("4. As a dealer I want to view Title Management Frequently Asked Questions", function() {
    resources.clickTitleManagement();
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Records%20Title%20FAQ.pdf');
  });
  it("5. As a dealer I want to view instructions for buyers", function() {
    resources.clickInstructionsForBuyers();
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/NextGear%20Capital%20Website%20Guide%20-%20Buyers.pdf');
  });
  it("6. As a dealer I want to view welcome letter", function() {
    resources.clickWelcomeLetter();
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Welcome%20Letter.pdf');
  });
  it("7. As a dealer I want to view guidelines", function() {
    resources.clickGuidelines();
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Insurance%20Guidelines.pdf');
  });
  it("8. As a dealer I want to view information sheet", function() {
    resources.clickInformationSheet();
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Information%20Sheet.pdf');
  });
  it("9. As a dealer I want to view claim form", function() {
    resources.clickClaimForm();
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Claim%20Form.pdf');
  });
  it("10. As a dealer I want to download IOS app", function() {
    resources.clickIosApp();
    resources.checkNewTab('https://itunes.apple.com/us/app/nextgear-capital/id748609885?mt=8');
  });
  it("11. As a dealer I want to download android app", function() {
    resources.clickAndroid();
    resources.checkNewTab('https://play.google.com/store/apps/details?id=com.nextgear.mobile');
  });

});

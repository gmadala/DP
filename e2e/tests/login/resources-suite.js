'use strict';

// var loginRecover = require('../../framework/login-recover-objects.js');
var login = require('../../framework/login.js');
var modal = require('../../framework/modal-objects.js');
var dashboard = require('../../framework/dashboard-objects.js');
var receipts = require('../../framework/receipts-objects.js');
var resources = require('../../framework/resources-objects');
var delay = 200;
var homepageUrl="https://test.nextgearcapital.com/test/#/login";
var userName= '97421EH';
var password= 'ngcpass!0';
describe("Log In Suite  \n ", function () {

  beforeEach(function () {
    browser.get(homepageUrl);
    browser.ignoreSynchronization = true;
    browser.sleep(delay);

  });

  it("1. As a dealer I want to view rates in fees in resources", function () {
    //Login and go to request credit increase
    login.login2(userName,password);
    dashboard.clickResources();
    resources.clickRatesAndFees();
    resources.checkNewTab('https://test.nextgearcapital.com/MobileService/api/dealer/feeschedule/FeeSchedule?AuthToken');
  });
  it("2. As a dealer I want to view welcome packet", function () {
    //Login and go to request credit increase
    login.login2(userName,password);
    dashboard.clickResources();
    resources.clickWelcomePacket();
    resources.checkNewTab('http://www.nextgearcapital.com/welcome-packet/');
  });
  it("3. As a dealer I want to view dealer funding checklist", function () {
    //Login and go to request credit increase
    login.login2(userName,password);
    dashboard.clickResources();
    resources.clickDealerFunding();
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Dealer%20Funding%20Checklist.pdf');
  });
  it("4. As a dealer I want to view Title Management Frequently Asked Questions", function () {
    //Login and go to request credit increase
    login.login2(userName,password);
    dashboard.clickResources();
    resources.clickTitleManagement();
    browser.sleep(2000);
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Records%20Title%20FAQ.pdf');
  });
  it("5. As a dealer I want to view instructions for buyers", function () {
    //Login and go to request credit increase
    login.login2(userName,password);
    dashboard.clickResources();
    resources.clickInstructionsForBuyers();
    browser.sleep(2000);
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/NextGear%20Capital%20Website%20Guide%20-%20Buyers.pdf');
  });
  it("6. As a dealer I want to view welcome letter", function () {
    //Login and go to request credit increase
    login.login2(userName,password);
    dashboard.clickResources();
    resources.clickWelcomeLetter();
    browser.sleep(2000);
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Welcome%20Letter.pdf');
  });
  it("7. As a dealer I want to view guidelines", function () {
    //Login and go to request credit increase
    login.login2(userName,password);
    dashboard.clickResources();
    resources.clickGuidelines();
    browser.sleep(2000);
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Insurance%20Guidelines.pdf');
  });
  it("8. As a dealer I want to view information sheet", function () {
    //Login and go to request credit increase
    login.login2(userName,password);
    dashboard.clickResources();
    resources.clickInformationSheet();
    browser.sleep(2000);
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Information%20Sheet.pdf');
  });
  it("9. As a dealer I want to view claim form", function () {
    //Login and go to request credit increase
    login.login2(userName,password);
    dashboard.clickResources();
    resources.clickClaimForm();
    browser.sleep(2000);
    resources.checkNewTab('https://test.nextgearcapital.com/test/documents/Claim%20Form.pdf');
  });
  it("10. As a dealer I want to download IOS app", function () {
    //Login and go to request credit increase
    login.login2(userName,password);
    dashboard.clickResources();
    resources.clickIosApp();
    browser.sleep(2000);
    resources.checkNewTab('https://itunes.apple.com/us/app/nextgear-capital/id748609885?mt=8');
  });
  it("11. As a dealer I want to download android app", function () {
    //Login and go to request credit increase
    login.login2(userName,password);
    dashboard.clickResources();
    resources.clickAndroid();
    browser.sleep(2000);
    resources.checkNewTab('https://play.google.com/store/apps/details?id=com.nextgear.mobile');
  });

});

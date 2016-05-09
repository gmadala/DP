'use strict';

// var loginRecover = require('../../framework/login-recover-objects.js');
var login = require('../../framework/login.js');
var modal = require('../../framework/modal-objects.js');
var dashboard = require('../../framework/dashboard-objects.js');
var creditIncrease = require('../../framework/credit-increase-request-objects.js');
var receipts = require('../../framework/receipts-objects.js');
var resources = require('../../framework/resources-objects');
var delay = 200;
var homepageUrl="https://test.nextgearcapital.com/test/#/login";
var tempIncrease= 1000;
var userName= '53190md';
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



});

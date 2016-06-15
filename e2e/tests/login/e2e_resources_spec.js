'use strict';


var resources = require('../../framework/e2e_resources_objects.js');
var loginObjects = require('../../framework/e2e_login_objects.js');
var recoverErrorMessage = require('../../framework/login-recover-objects.js');
var login = require('../../framework/login.js');
var modalObjects = require('../../framework/e2e_modal_objects.js');
var execSettings = require('../../framework/e2e_execSettings.js');
var incorrectAnswer = 'f';
var correctAnswer = 'a';
var validEmail = 'test@gmail.com';
var invalidEmail = 'asdas@gmail.com';
var invalidFormatEmail = 'testtesttest';
var username = '53190md';
var password = 'ngcpass!0';

var resources = new resources.resources();

var loginObjects = new loginObjects.loginObjects();
var modalObjects = new modalObjects.modalObjects();

var homepageUrl = "http://localhost:9000/#/login";
var delay = 2000;

describe('Testing Resources Page', function() {


  beforeEach(function() {
    browser.driver.manage().window().maximize();
    browser.get(homepageUrl);
    browser.sleep(delay);
    browser.waitForAngular();
    login.login();
    resources.clickResources();
    browser.sleep(delay);
  });

  it('click on the Rates and Fees link', function() {
    resources.doRatesAndFees();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toContain("https://test.nextgearcapital.com/mobileservice/api/dealer/feeschedule/FeeSchedule?AuthToken=");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  // //Welcome packet is taking too much time to load that causes other test cases fail.
  // //So for time being excluding this test case, this needs little bit research on this.
  // xit('click on the Welcome Packet', function() {
  //   resources.clickWelcomePacket();
  //   browser.getAllWindowHandles().then(function(handles) {
  //     browser.switchTo().window(handles[1]).then(function() {
  //       browser.ignoreSynchronization = true;
  //       expect(browser.getCurrentUrl()).toEqual("http://www.nextgearcapital.com/welcome-packet/");
  //       browser.wait(250000);
  //       browser.close();
  //       browser.ignoreSynchronization = false;
  //       browser.driver.switchTo().window(handles[0]);
  //     });
  //   });
  // });
  //
  // it('click on the Dealer Funding Checklist', function() {
  //   resources.clickDealerFundingChecklist();
  //   browser.getAllWindowHandles().then(function(handles) {
  //     browser.switchTo().window(handles[1]).then(function() {
  //       browser.ignoreSynchronization = true;
  //       expect(browser.getCurrentUrl()).toEqual("http://localhost:9000/documents/Dealer%20Funding%20Checklist.pdf");
  //       browser.ignoreSynchronization = false;
  //       browser.close();
  //       browser.driver.switchTo().window(handles[0]);
  //     });
  //   });
  // });
  //
  // it('click on the Title Management link', function() {
  //   resources.clickTitleManagement();
  //   browser.getAllWindowHandles().then(function(handles) {
  //     browser.switchTo().window(handles[1]).then(function() {
  //       browser.ignoreSynchronization = true;
  //       expect(browser.getCurrentUrl()).toEqual("http://localhost:9000/documents/Records%20Title%20FAQ.pdf");
  //       browser.ignoreSynchronization = false;
  //       browser.close();
  //       browser.driver.switchTo().window(handles[0]);
  //     });
  //   });
  // });
  //
  // it('click on the Instrunctions For Buyers', function() {
  //   resources.clickInstructionsForBuyers();
  //   browser.getAllWindowHandles().then(function(handles) {
  //     browser.switchTo().window(handles[1]).then(function() {
  //       browser.ignoreSynchronization = true;
  //       expect(browser.getCurrentUrl()).toEqual("http://localhost:9000/documents/NextGear%20Capital%20Website%20Guide%20-%20Buyers.pdf");
  //       browser.ignoreSynchronization = false;
  //       browser.close();
  //       browser.driver.switchTo().window(handles[0]);
  //     });
  //   });
  // });
  // it('click on the Welcome Letter', function() {
  //   resources.clickWelcomeLetter();
  //   browser.getAllWindowHandles().then(function(handles) {
  //     browser.switchTo().window(handles[1]).then(function() {
  //       browser.ignoreSynchronization = true;
  //       expect(browser.getCurrentUrl()).toEqual("http://localhost:9000/documents/Welcome%20Letter.pdf");
  //       browser.ignoreSynchronization = false;
  //       browser.close();
  //       browser.driver.switchTo().window(handles[0]);
  //     });
  //   });
  // });
  //
  // it('click on the Guidelines', function() {
  //   resources.clickGuidelines();
  //   browser.getAllWindowHandles().then(function(handles) {
  //     browser.switchTo().window(handles[1]).then(function() {
  //       browser.ignoreSynchronization = true;
  //       expect(browser.getCurrentUrl()).toEqual("http://localhost:9000/documents/Insurance%20Guidelines.pdf");
  //       browser.ignoreSynchronization = false;
  //       browser.close();
  //       browser.driver.switchTo().window(handles[0]);
  //     });
  //   });
  // });
  //
  // it('click on the Information Sheet', function() {
  //   resources.clickInformationSheet();
  //   browser.getAllWindowHandles().then(function(handles) {
  //     browser.switchTo().window(handles[1]).then(function() {
  //       browser.ignoreSynchronization = true;
  //       expect(browser.getCurrentUrl()).toEqual("http://localhost:9000/documents/Information%20Sheet.pdf");
  //       browser.ignoreSynchronization = false;
  //       browser.close();
  //       browser.driver.switchTo().window(handles[0]);
  //     });
  //   });
  // });
  //
  // it('click on the Claim Form', function() {
  //   resources.clickClaimForm();
  //   browser.getAllWindowHandles().then(function(handles) {
  //     browser.switchTo().window(handles[1]).then(function() {
  //       browser.ignoreSynchronization = true;
  //       expect(browser.getCurrentUrl()).toEqual("http://localhost:9000/documents/Claim%20Form.pdf");
  //       browser.ignoreSynchronization = false;
  //       browser.close();
  //       browser.driver.switchTo().window(handles[0]);
  //     });
  //   });
  // });
  //
  // it('click on the myNextGear Mobile IOS', function() {
  //   resources.clickMobileIOS();
  //   browser.getAllWindowHandles().then(function(handles) {
  //     browser.switchTo().window(handles[1]).then(function() {
  //       browser.ignoreSynchronization = true;
  //       expect(browser.getCurrentUrl()).toEqual("https://itunes.apple.com/us/app/nextgear-capital/id748609885?mt=8");
  //       browser.ignoreSynchronization = false;
  //       browser.close();
  //       browser.driver.switchTo().window(handles[0]);
  //     });
  //   });
  // });
  //
  // it('click on the myNextGear Mobile Android', function() {
  //   resources.clickMobileAndroid();
  //   browser.getAllWindowHandles().then(function(handles) {
  //     browser.switchTo().window(handles[1]).then(function() {
  //       browser.ignoreSynchronization = true;
  //       expect(browser.getCurrentUrl()).toEqual("https://play.google.com/store/apps/details?id=com.nextgear.mobile");
  //       browser.ignoreSynchronization = false;
  //       browser.close();
  //       browser.driver.switchTo().window(handles[0]);
  //     });
  //   });
  // });

});

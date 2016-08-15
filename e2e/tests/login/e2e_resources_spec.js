'use strict';

var loginObjects = require('../../framework/e2e_login_objects.js');
var resources = require('../../framework/e2e_resources_objects.js');
var login = require('../../framework/e2e_login.js');
var execSettings = require('../../framework/e2e_execSettings.js');
var helper = require('../../framework/e2e_helper_functions.js');

var loginObjects = new loginObjects.loginObjects();
var resources = new resources.resources();
var helper = new helper.helper();

describe('\n Resources Page', function () {

  beforeEach(function () {
    browser.sleep(browser.params.shortDelay);
  });

  it("1. Resources - Login as 62434AM", function () {
    helper.goToLogin();
    browser.sleep(browser.params.shortDelay);
    loginObjects.doGoodLogin();
    helper.goToResources();
    browser.sleep(browser.params.shortDelay);
    expect(browser.getCurrentUrl()).toEqual(execSettings.resourcesPage());
  });

  it("2. Resources - Validating the Rates and Fees link", function () {
    helper.goToResources();
    resources.doRatesAndFees();
    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]).then(function () {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toContain("https://test.nextgearcapital.com/MobileService/api/dealer/feeschedule/FeeSchedule?AuthToken=");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  //Welcome packet is taking too much time to load that causes other test cases fail.
  xit("3. Resources - Validating the Welcome Packet", function () {
    helper.goToResources();
    resources.doWelcomePacket();
    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]).then(function () {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("http://www.nextgearcapital.com/welcome-packet/");
        browser.close();
        browser.ignoreSynchronization = false;
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it("4. Resources - Validating the Dealer Funding Checklist", function () {
    helper.goToResources();
    resources.doDealerFunding();
    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]).then(function () {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/documents/Dealer%20Funding%20Checklist.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it("5. Resources - Validating the Title Management link", function () {
    helper.goToResources();
    resources.doTitleManagement();
    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]).then(function () {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/documents/Records%20Title%20FAQ.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it("6. Resources - Validating the Instrunctions For Buyers", function () {
    helper.goToResources();
    resources.doInstructionsForBuyers();
    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]).then(function () {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/documents/NextGear%20Capital%20Website%20Guide%20-%20Buyers.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });
  it("7. Resources - Validating the Welcome Letter", function () {
    helper.goToResources();
    resources.doWelcomeLetter();
    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]).then(function () {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/documents/Welcome%20Letter.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it("8. Resources - Validating the Guidelines", function () {
    helper.goToResources();
    resources.doGuidelines();
    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]).then(function () {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/documents/Insurance%20Guidelines.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it("9. Resources - Validating the Information Sheet", function () {
    helper.goToResources();
    resources.doInformationSheet();
    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]).then(function () {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/documents/Information%20Sheet.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it("10. Resources - Validating the Claim Form", function () {
    helper.goToResources();
    resources.doClaimForm();
    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]).then(function () {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/documents/Claim%20Form.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it("11. Resources - Validating the myNextGear Mobile IOS", function () {
    helper.goToResources();
    resources.doMobileIOS();
    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]).then(function () {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://itunes.apple.com/us/app/nextgear-capital/id748609885?mt=8");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it("12. Resources - Validating the myNextGear Mobile Android", function () {
    helper.goToResources();
    resources.doMobileAndroid();
    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]).then(function () {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://play.google.com/store/apps/details?id=com.nextgear.mobile");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it("13. Resources - Logout", function () {
    browser.sleep(browser.params.shortDelay);
    login.logout();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });
});

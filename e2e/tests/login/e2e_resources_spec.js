'use strict';

var loginObjects = require('../../framework/e2e_login_objects.js');
var resources = require('../../framework/e2e_resources_objects.js');
var login = require('../../framework/e2e_login.js');
var execSettings = require('../../framework/e2e_execSettings.js');

var loginObjects = new loginObjects.loginObjects();
var resources = new resources.resources();

var delay = 2000;

describe('Testing Resources Page', function() {

  beforeEach(function() {
    browser.driver.manage().window().maximize();
  });

  it('Dealer - Login', function() {
    browser.get(execSettings.loginPage());
    browser.sleep(delay);
    login.login();
    resources.doResources();
    browser.sleep(delay);
    expect(browser.getCurrentUrl() === execSettings.resourcesPage());
  });

  it('Validating  the Rates and Fees link', function() {
    browser.get(execSettings.resourcesPage());
    resources.doRatesAndFees();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toContain("https://test.nextgearcapital.com/MobileService/api/dealer/feeschedule/FeeSchedule?AuthToken=65415B3C-C684-433D-80FD-3387EAB95043");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  //Welcome packet is taking too much time to load that causes other test cases fail.
  xit('Validating the Welcome Packet', function() {
    browser.get(execSettings.resourcesPage());
    resources.doWelcomePacket();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("http://www.nextgearcapital.com/welcome-packet/");
        browser.close();
        browser.ignoreSynchronization = false;
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it('Validating the Dealer Funding Checklist', function() {
    browser.get(execSettings.resourcesPage());
    resources.doDealerFunding();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/documents/Dealer%20Funding%20Checklist.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it('Validating the Title Management link', function() {
    browser.get(execSettings.resourcesPage());
    resources.doTitleManagement();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/documents/Records%20Title%20FAQ.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it('Validating the Instrunctions For Buyers', function() {
    browser.get(execSettings.resourcesPage());
    resources.doInstructionsForBuyers();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/documents/NextGear%20Capital%20Website%20Guide%20-%20Buyers.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });
  it('Validating the Welcome Letter', function() {
    browser.get(execSettings.resourcesPage());
    resources.doWelcomeLetter();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/documents/Welcome%20Letter.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it('Validating the Guidelines', function() {
    browser.get(execSettings.resourcesPage());
    resources.doGuidelines();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/documents/Insurance%20Guidelines.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it('Validating the Information Sheet', function() {
    browser.get(execSettings.resourcesPage());
    resources.doInformationSheet();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/documents/Information%20Sheet.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it('Validating the Claim Form', function() {
    browser.get(execSettings.resourcesPage());
    resources.doClaimForm();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/documents/Claim%20Form.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it('Validating the myNextGear Mobile IOS', function() {
    browser.get(execSettings.resourcesPage());
    resources.doMobileIOS();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://itunes.apple.com/us/app/nextgear-capital/id748609885?mt=8");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it('Validating the myNextGear Mobile Android', function() {
    browser.get(execSettings.resourcesPage());
    resources.doMobileAndroid();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://play.google.com/store/apps/details?id=com.nextgear.mobile");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it("Logout Resources", function () {
    browser.sleep(delay);
    loginObjects.doMyAccount();
    login.clickSignoutButton();
    login.clickSignoutConfirm();
    expect(browser.getCurrentUrl() === execSettings.loginPage());
  });
});

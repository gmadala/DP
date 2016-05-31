'use strict';

var login = require('../../framework/login.js');
var resources = require('../../framework/resources-objects.js');

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
    resources.clickRatesAndFees();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/mobileservice/api/dealer/feeschedule/FeeSchedule?AuthToken=65415B3C-C684-433D-80FD-3387EAB95043");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  //Welcome packet is taking too much time to load that causes other test cases fail.
  //So for time being excluding this test case, this needs little bit research on this.
  xit('click on the Welcome Packet', function() {
    resources.clickWelcomePacket();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("http://www.nextgearcapital.com/welcome-packet/");
        browser.wait(250000);
        browser.close();
        browser.ignoreSynchronization = false;
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it('click on the Dealer Funding Checklist', function() {
    resources.clickDealerFundingChecklist();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("http://localhost:9000/documents/Dealer%20Funding%20Checklist.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it('click on the Title Management link', function() {
    resources.clickTitleManagement();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("http://localhost:9000/documents/Records%20Title%20FAQ.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it('click on the Instrunctions For Buyers', function() {
    resources.clickInstructionsForBuyers();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("http://localhost:9000/documents/NextGear%20Capital%20Website%20Guide%20-%20Buyers.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });
  it('click on the Welcome Letter', function() {
    resources.clickWelcomeLetter();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("http://localhost:9000/documents/Welcome%20Letter.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it('click on the Guidelines', function() {
    resources.clickGuidelines();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("http://localhost:9000/documents/Insurance%20Guidelines.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it('click on the Information Sheet', function() {
    resources.clickInformationSheet();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("http://localhost:9000/documents/Information%20Sheet.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it('click on the Claim Form', function() {
    resources.clickClaimForm();
    browser.getAllWindowHandles().then(function(handles) {
      browser.switchTo().window(handles[1]).then(function() {
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual("http://localhost:9000/documents/Claim%20Form.pdf");
        browser.ignoreSynchronization = false;
        browser.close();
        browser.driver.switchTo().window(handles[0]);
      });
    });
  });

  it('click on the myNextGear Mobile IOS', function() {
    resources.clickMobileIOS();
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

  it('click on the myNextGear Mobile Android', function() {
    resources.clickMobileAndroid();
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

});

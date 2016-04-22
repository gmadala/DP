/**
 * Created by Javier.Calderon on 3/29/2016.
 */
var delay = 200;

creditIncrease = {
  permanentIncrease: function () {

    return element(by.id('isNotTemp'));

  },

  firstLineOfCredit: function () {

    return element.all(by.id('lineOfCredit')).get(1);

  },
  temporaryIncrease: function () {

    return element(by.id('isTemp'));

  },
  increaseAmount: function () {

    return element(by.id('increaseAmt'));

  },
  requestButton: function () {

    return element(by.id('confirmRequestButton'));

  },

//Locator End

  //Clicking
  clickPermanentIncrease: function () {

    this.permanentIncrease().click();
    browser.sleep(delay);

  },

  clickRequestButton: function () {

    this.requestButton().click();
    browser.sleep(delay);

  },
  clickFirstLineOfCredit: function () {

    this.firstLineOfCredit().click();
    browser.sleep(delay);

  },
  clickTemporaryIncrease: function () {

    this.temporaryIncrease().click();
    browser.sleep(delay);

  },

  //Getting
  getPasswordErrorTextPhoneNumber: function () {
    return this.passwordErrorPhoneNumbers().get(2).getText();

  },



  //Sending
  enterIncreaseAmount: function (param) {

     this.increaseAmount().sendKeys(param);
    browser.sleep(delay);

  },



  //Count
  disabledCount: function () {

    return this.disabledFields().count();

  },
  //LAST ONE
  placeholder: function (index) {

    this._thumbnail(index).click();

  }
};

module.exports = creditIncrease;

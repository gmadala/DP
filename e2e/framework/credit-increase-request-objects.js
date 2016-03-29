/**
 * Created by Javier.Calderon on 3/29/2016.
 */
var delay = 200;

creditIncrease = {

  firstLineOfCredit: function () {

    return element.all(by.id('lineOfCredit')).get(1);

  },

//Locator End

  //Clicking
  clickfirstLineOfCredit: function () {

    this.firstLineOfCredit().click();
    browser.sleep(delay);

  },


  //Getting
  getPasswordErrorTextPhoneNumber: function () {
    return this.passwordErrorPhoneNumbers().get(2).getText();

  },



  //Sending
  enterQuestion9: function (param) {

    return this.securityQuestion9().clear().sendKeys(param);

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

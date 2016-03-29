/**
 * Created by Javier.Calderon on 3/29/2016.
 */
var delay = 200;

dashboard = {

  requestCreditIncrease: function () {

    return element(by.id('requestCreditButton'));

  },

//Locator End

  //Clicking
  clickRequestCreditIncreaset: function () {

    this.requestCreditIncrease().click();
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

module.exports = dashboard;

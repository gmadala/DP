var userName = '53190md';
var password = 'ngcpass!0';
loginRecover = {


    elements: {
        //Locators

        forgotUsernamePassword: function() {

            return element(by.id("forgotUsernamePassword"));

        },

        userName: function() {

            return element(by.id("credUsername"));

        },
        signUpLogin: function() {

            return element(by.id("signUpLogin"));

        },
        password: function() {

            return element(by.id("credPassword"));

        },
        loginButton: function() {

            return element(by.id("loginButton"));

        },


    }, //Locator End

    //Clicking
    clickLoginButton: function() {

        return this.elements.loginButton().click();

    },
     clickforgotUsernamePassword: function() {

        return this.elements.forgotUsernamePassword().click();

    },
    clicksignUpLogin: function() {

        return this.elements.signUpLogin().click();

    },

    //Getting
    getLoginButtonText: function() {


        return this.elements.loginButton().getText();

    },
    textsignUpLogin: function() {


        return this.elements.signUpLogin().getText();

    },
    textforgotUsernamePassword: function() {

        return this.elements.forgotUsernamePassword().getText();

    },

    //Sending
    enterUsername: function() {

        return this.elements.userName().clear().sendKeys(userName);

    },
     enterPassword: function() {

        return this.elements.password().clear().sendKeys(password);

    },
    //Functions
    login: function() {
        this.enterUsername(userName);
        this.enterPassword(password);
        this.clickLoginButton();
    },

    //LAST ONE
    placeholder: function(index) {

        this.elements._thumbnail(index).click();

    }
};


module.exports = loginRecover;

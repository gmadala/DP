'use strict';
 
var LoginPageObject = function(){
};
	
	LoginPageObject.prototype = Object.create({},{

		 
		//Locators
		loginUrl:{ value: "http://localhost:9000/#/login"
		},

		homeURL:{ value: "http://localhost:9000/#/Home"
		},
        
        loginButton:{ get: function(){
	 		return browser.element(by.buttonText("Log In")); 	
		}},

		rememberUserNameCheckbox: { get: function(){			
			return browser.element(by.css(".checkbox-img"));  //.model("credentials.remember")); 
		}},

		username:{ get: function(){
			return browser.element(by.model("credentials.username"));	
		}},

		password:{ get: function(){
			return browser.element(by.model("credentials.password"));
		}},

		lnkForgotUsernamePassword: { get: function(){
			return browser.element(by.linkText("Forgot your username or password?"));
		}},

		//Setters
		setLogin: {
			value: function(username, password){
				this.username.sendKeys(username);
				this.password.sendKeys(password);
				browser.waitForAngular();
		}},


		//Doers
		doLogin: { 
			value: function(username, password){
			this.setLogin(username, password);			
			browser.waitForAngular();
		}},

		doRememberUsername:{
			value: function(){
				this.rememberUserNameCheckbox.click();
				browser.waitForAngular();				
		}},

		doRecover: { 
			value: function(){
			this.goRecover();
			browser.waitForAngular();
		}},

		//Getters
		getUsername: {
			value: function(){
				this.username.getAttribute('value');
		}},

		//Navigation
		goToLogin: {
			value: function(){
				this.loginButton.click();
		}}

});
module.exports = LoginPageObject;
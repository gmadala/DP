'use strict';
 
var UtilObject = function(){
};
	
	UtilObject.prototype = Object.create({},{

		// common functionality for all the forms		
		logoutnothanksbutton: {  get: function(){
			return browser.element(by.css('[ng-click="close(false)"]'))

		}},

		logoutyesbutton: { get: function(){
			return browser.element(by.css('[ng-click="close(true)"]'));
		}},

		//Navigation
		goToLogoutYesButton:{
			value: function(){
				this.logoutyesbutton.click();
		}},

		goToLogoutNoThanksButton: {
			value: function(){
				this.logoutnothanksbutton.click();
		}}

	});

	module.exports = UtilObject;
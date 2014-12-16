'use strict';
 
var HomePageObject = function(){
};
	
	HomePageObject.prototype = Object.create({},{

		 
		// Locators
		homeURL:{ value: "http://localhost:9000/#/Home"
		},
        
        signOutButton:{ get: function(){
	 		return browser.element(by.css('[ng-click="user.logout()"]'));
	 	}},

		menuDropdown: { get: function(){
			return browser.element(by.css('.nxg-dropdown'))
		}},

		//Navigation
		goToSignOut: {
			value: function(){
				this.signOutButton.click(); 
				browser.waitForAngular(); 
		}},

		goToHome: {
			value: function(){
				this.homeURL.click();
		}},

		goToMenuDropdown:{
			value: function(){
			this.menuDropdown.click();
		}}		

});
module.exports = HomePageObject;
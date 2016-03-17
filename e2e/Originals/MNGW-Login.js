describe("Log In Suite  \n ", function() {


	beforeEach(function() {
		browser.get("https://test.nextgearcapital.com/test/#/login");
		browser.ignoreSynchronization = true;
	});

	it("Should be on correct page", function() {

		expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login");


	});
	var loginRecover = require('../Protractor/login-recover.js');
	var login = require('../Protractor/login.js');
	var modal_objects = require('../Protractor/modal_objects.js');

	it("Successful Login", function() {
		browser.sleep(5000);
		login.login();
		browser.sleep(5000);
	});

	it("As a new dealer I want to signup to Mynextgear", function() {

		browser.sleep(5000);
		//Check button text
		expect(login.textsignUpLogin()).toEqual("Sign Up");

		//Click signup
		login.clicksignUpLogin();
		browser.sleep(5000);
		//Validate correct URL
		expect(browser.getCurrentUrl()).toEqual("http://www.nextgearcapital.com/apply-for-credit/");



	});
	it("As a dealer I forgot my user name. My email is correct and no problems", function() {
		browser.sleep(5000);
		//Check Forgot username or password link
		expect(login.textforgotUsernamePassword()).toEqual("Forgot your username or password?");
		login.clickforgotUsernamePassword();
		browser.sleep(5000);
		expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login/recover");
		loginRecover.enterEmail();
		browser.sleep(5000);
		//Click and check Submit button text
		expect(loginRecover.getSubmitButtonText()).toEqual("Submit");
		loginRecover.clickUsernameSubmit();
		browser.sleep(5000);
		//Verify Success Modal
		expect(modal_objects.getmodalHeaderText()).toEqual("Success");
		expect(modal_objects.getmodalBodyText()).toEqual("Thank you, check your email for the requested account information.");
		//Exit out and verify back to main
		modal_objects.clickOkButton();
		expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login");



	});

	it("As a dealer I forgot my user name. My email is NOT correct and have to reenter email", function() {
		browser.sleep(5000);
		//Check button text
		expect(login.textforgotUsernamePassword()).toEqual("Forgot your username or password?");
		login.clickforgotUsernamePassword();
		browser.sleep(5000);
		expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login/recover");
		//Enter invalid email
		loginRecover.enterInvalidEmail();
		//Check username box is disabled and submit
		expect(loginRecover.userNameDisabledCount()).toEqual(1);
		expect(loginRecover.getSubmitButtonText()).toEqual("Submit");
		loginRecover.clickUsernameSubmit();
		browser.sleep(5000);
		//Verify error message text
		expect(loginRecover.getemailNotFoundText()).toEqual("We were unable to locate this email address. If you need assistance, please call NextGear Capital Support at:");
		expect(loginRecover.getemailNotFoundNumbers()).toContain("United States 1.888.969.3721");
		expect(loginRecover.getemailNotFoundNumbers()).toContain("Canada - Quebec 1.855.864.9291");
		expect(loginRecover.getemailNotFoundNumbers()).toContain("Canada - National 1.877.864.9291");
		//Enter incorrect email and submit
		loginRecover.enterInvalidEmailFormat();
		loginRecover.clickUsernameSubmit();
		expect(loginRecover.getIncorrectEmailFormat()).toContain("is not a valid email address. If you need assistance, please call NextGear Capital Support at:");
		//Enter correct email and submit
		loginRecover.enterEmail();
		loginRecover.clickUsernameSubmit();
		browser.sleep(5000);
		//Verify Success Modal
		expect(modal_objects.getmodalHeaderText()).toEqual("Success");
		expect(modal_objects.getmodalBodyText()).toEqual("Thank you, check your email for the requested account information.");
		//Exit out and verify back to main
		modal_objects.clickOkButton();
		expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login");

	});

	it("As a dealer I forgot my password. All my answers are correct", function() {
		browser.sleep(5000);
		//Check button text
		expect(login.textforgotUsernamePassword()).toEqual("Forgot your username or password?");
		login.clickforgotUsernamePassword();
		browser.sleep(5000);
		expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login/recover");
		//Enter Username
		loginRecover.enterValidUserName();
		//Validate email address field is disabled and click
		expect(loginRecover.userNameDisabledCount()).toEqual(1);
		browser.sleep(5000);
		loginRecover.clickPasswordButton();
		browser.sleep(5000);
		//Answer Security Questions and validate
		expect(loginRecover.getSecurityQuestion10Text()).toEqual("What is the name of a college you applied to but didn't attend?");
		loginRecover.enterQuestion10();
		expect(loginRecover.getSecurityQuestion6Text()).toEqual("In what city or town was your first job?");
		loginRecover.enterQuestion6();
		expect(loginRecover.getSecurityQuestion9Text()).toEqual("What is your maternal grandmother's maiden name?");
		loginRecover.enterQuestion9();
		loginRecover.clickPasswordButton();
		browser.sleep(5000);
		//Verify Success Modal
		expect(modal_objects.getmodalHeaderText()).toEqual("Success");
		expect(modal_objects.getmodalBodyText()).toEqual("Thank you, check your email for the requested account information.");
		//Exit out and verify back to main
		modal_objects.clickOkButton();
		expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login");

	});
//Not working yet
	xit("As a dealer I forgot my password. My first answers are NOT correct", function() {
		browser.sleep(5000);
		//Check button text
		expect(login.textforgotUsernamePassword()).toEqual("Forgot your username or password?");
		login.clickforgotUsernamePassword();
		browser.sleep(5000);
		expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login/recover");
		//Enter Username
		loginRecover.enterValidUserName();
		//Validate email address field is disabled and click
		expect(loginRecover.userNameDisabledCount()).toEqual(1);
		browser.sleep(5000);
		loginRecover.clickPasswordButton();
		browser.sleep(5000);
		//Enter INCORRECT Security Questions and validate
		expect(loginRecover.getSecurityQuestion10Text()).toEqual("What is the name of a college you applied to but didn't attend?");
		loginRecover.enterIncorrectQuestion10();
		expect(loginRecover.getSecurityQuestion6Text()).toEqual("In what city or town was your first job?");
		loginRecover.enterIncorrectQuestion6();
		expect(loginRecover.getSecurityQuestion9Text()).toEqual("What is your maternal grandmother's maiden name?");
		loginRecover.enterIncorrectQuestion9();
		loginRecover.clickPasswordButton();

		//Validate Error Messages
		expect(loginRecover.getPasswordErrorText()).toEqual("We were unable verify one or more of your answers. If you need assistance, please call NextGear Capital Support at:");
		// expect(loginRecover.getPasswordErrorTextPhoneNumber()).toContain("United States 1.888.969.3721");
		// expect(loginRecover.getPasswordErrorTextPhoneNumber()).toContain("Canada - Quebec 1.855.864.9291");
		// expect(loginRecover.getPasswordErrorTextPhoneNumber()).toContain("Canada - National 1.877.864.9291");
		// browser.sleep(5000);
		//Answer Security Questions and validate
		expect(loginRecover.getSecurityQuestion10Text()).toEqual("What is the name of a college you applied to but didn't attend?");
		loginRecover.enterQuestion10();
		expect(loginRecover.getSecurityQuestion6Text()).toEqual("In what city or town was your first job?");
		loginRecover.enterQuestion6();
		expect(loginRecover.getSecurityQuestion9Text()).toEqual("What is your maternal grandmother's maiden name?");
		loginRecover.enterQuestion9();
		loginRecover.clickPasswordButton();
		browser.sleep(10000);
		//Verify Success Modal
		expect(modal_objects.getmodalHeaderText()).toEqual("Success");
		expect(modal_objects.getmodalBodyText()).toEqual("Thank you, check your email for the requested account information.");
		//Exit out and verify back to main
		modal_objects.clickOkButton();
		browser.sleep(5000);
		// expect(browser.getCurrentUrl()).toEqual("https://test.nextgearcapital.com/test/#/login");

	});


});

###Building the Credit Application


####Purpose:
This page has the details one needs in order to build the credit application and deploy it to test and to production


####Prerequisites:
In order to perform the build and deploy, you must have RDC access to the target machine.


Have a windows VM (or machine) as this doesn't work on the mac RDC


####Environments:
**Test**


machine = Crusher.nextgearcapital.com
Url to App = https://test.nextgearcapital.com/eui/creditapplication/#/  


**Production/Live**


machine = ColoLWeb01.nextgearcapital.com
Url to App = https://customer.nextgearcapital.com/NGCApplication/#/


####Build and Deploy Instructions:
Build code on your local machine with the following command:  grunt build --target={test|production|training}


Everything is built to the dist/ folder in your project


Go on to your Remote Desktop connection


Open windows explorer and find your mounted shared drive


Replace the contents of c:\www\EUI_test\creditApplicationApp with the contents from your project dist/ directory (located in the mounted share drive)

###Using Phonegap (Cordova)
In order to use cordova (phonegap) tools, you must follow these installation and configuration directions. These are OS X directions.  


####Install tools  
* Download and install node.js from http://nodejs.org/  
* Install cordova (version 3.0.0. As of 6/2014 the barcode scanner requires cordova version 3.0.0 to function. terminal command: cordova: sudo npm install -g cordova@3.0.0)  
* Install ADT from http://developer.android.com/sdk/index.html  
* Install Xcode from the Apple App Store  
* put the android sdk on your command path
* Start your anrdoid enabled eclipes (ADT) go to ADT->Preferences->Android and copy the SDK location (ex. /Applications/eclipses/adt-bundle-mac-x86_64-20130522/sdk) and append /tools to the end.
* put this string in your command path (OS X: sudo nano /etc/paths)
* start a new terminal so the path is picked up. 
* Make sure ANDROID_HOME env variable is set (OS X: export ANDROID_HOME=/Applications/eclipses/adt-bundle-mac-x86_64-20130522/sdk)
* Install Android 4.2.2 (API 17)
* In ADT, go to Window > Android SDK Manager
* Select Android 4.2.2 (API 17) and INstall packages. 
* install brew (terminal: ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)")
* Make sure you have the latest version of Xcode installed
* install ios-sim (terminal: brew install ios-sim)


####In the mobile-apps dir execute these commands:
* cordova build  - this builds the app
* cordova build ios - to build ios
* cordova build android - to build android  
(The build commands copy the www dir to the correct location)
* cordova emulate android - to emulate android
* cordova emulate ios - to emulate ios


####Setup IDEs
Once cordova has created the correct project structures, the projects can be opened with ADT or Xcode in order to modify the project.


**ADT (android)**


* Create a new directory called "workspace", this directory will be unrevision and can be anyplace.
* Open ADT and open the workspace, using the directory "workspace" you just created.
* Right click in the empty Package Explorer and select "Import…"
* Under the Android folder, select "Existing Android Code Into Workspace"
* For the root directory select "[your-project-dir]/NextGear/platforms/android"
* Leave "Copy projects into workspace" unchecked. This makes sure any changes you make are applied to the version under source control.
 
**Xcode (ios)**


* Simple navigate to "[your-project-dir]/NextGear/platforms/ios" in Finder and double click the "NextGear.xcodeproj"


**From a fresh mobile-apps checkout:**


* run: git clone <the repo URL>  
* run: cd into project dir.  
* run: git checkout develop
* run: npm install
* run: bower install
* run: grunt build:phonegap
* run: cd NextGear
* run: cordova build
* run: cordova emulate ios|android
 
Simple HTML Test Code
Stick the following in your index.html file to easy testing. 


    <script>
    angular.module('nextgearMobileApp')
    .controller('TestCtrl', function($scope, barscan) {
                $scope.barscan = function() {
                barscan.scan().then(function(text) {
                                    console.log('scanned', text);
                                    })
                }
                });
    </script>


    <div ng-controller="TestCtrl">
        <button ng-click="barscan()">Test Barscan</button>
    </div>
    
    <!--http://www.adobe.com/enterprise/accessibility/pdfs/acro7_pg_ue.pdf -->
    
    <button onClick="var ref = window.open('http://www.adobe.com/enterprise/accessibility/pdfs/acro7_pg_ue.pdf', '_blank', 'location=no,toolbar=yes,pdf=yes');">Open page</button>




    <script>
    function onSuccess(base64){
        alert('success');
    }
    function onFail(error){
        alert('success');
    }
    function doCamera(){
        navigator.camera.getPicture(onSuccess, onFail, {
                                        quality: 50,
                                        destinationType : 1,
                                        saveToPhotoAlbum : true,
                                        });
    }
    </script>


    <button onClick="doCamera()">Camera</button>
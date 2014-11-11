###Mobile Apps
####Production Prep:
* Create a new version in the app stores.
  * Google Play Store:  Add a new application
  * iTunes Connect: My Apps -> NextGear Capital -> New Version


**Build Instructions:**


* Get a report of all bugs/story tickets in Staging (waiting to be deployed to Test Build)
JIRA Search:  status = "EUI Staging" AND labels in (EUI) AND project in (Mobile) ORDER BY key ASC, priority DESC
* Pull latest from GIT repository.
  * git checkout develop
  * git pull --rebase
* Run test and jshint tasks to make sure source is in working order
  * grunt jshint
  * grunt test
* Quit any instances of XCode and Eclipse.
* Make build according to desired target (e.g. test, production, demo).
  * grunt build:phonegap --target={TARGET} --buildVersion={BUILD_VERSION}
  * e.g.    grunt build:phonegap --target=test --buildVersion=4.0.3
* Build is packaged into dist/ folder in your project.


**Android**


* Launch Eclipse
* Eclipse: Edit app name (res/values/strings.xml app_name)
  * Test: NGC Test
  * Demo: NGC Demo
  * Prod: NextGear Capital
* Production Builds
  * Increment version code in manifest (AndroidManifest.xml manifest/android:versionCode)
* Check it is using the correct package name
  * Test: com.nextgear.mobile.test
  * Demo: com.nextgear.demo
  * Prod: com.nextgear.mobile
* Export from eclipse (passwords are 'nextgear')
  * File -> Export
  * Export Android Application <Next>
  * Project: NextGear <Next>
  * Use existing keystore
    * Located in ./phonegap/platforms/android/Keystore
    * password: nextgear <Next>  
  * Use existing key, alias: nextgear, password: nextgear <Next>
  * Destination APK file:  <<choose location and name>> <Finish>
  * Suggested name pattern:  NextGear.{version}_{target}.apk e.g.  NextGear.4.0.3_Test.apk


**iOS**


* Launch XCode.
* Select NextGear project.
* General settings:
  * Check we are using the correct Bundle Identifier
    * Test (TestFlight): com.nextgear.mobile (Standard EUI Account)
    * Production: com.nextgearcapital.mobile (NextGear's Account)
    * Enterprise NextGear (Demo): com.nextgearcapital.mobile.enterprise
  * Check which team we are using.
    * EffectiveUI: Test builds (TestFlight)
    * NextGear Capital, Inc:  There are two of them. One for production, one for Demo (Enterprise) builds. Choose the one that doesn't complain about the Bundle Identifier not matching.
    * Note: XCode gets confused about not finding matching provisioning profiles for the BundleID/Team combination. Change the Team back and forth and hit 'Fix Issue' until it goes away.
  * Test builds: Swap Version and Build values (Build should be a single number, Version is the displayable build value (e.g. Version: 4.0.3, Build: 1)
  * Production builds: Version should match the production app placeholder on the app store (e.g. 9). Build should indicate the build version (e.g. 4.0.3).
* Info settings: 
  * Set the correct app display name (Info -> Bundle Display Name)
    * Test: NGC Test
    * Demo: NGC Demo
    * Prod: NextGear
* Capabilities settings:
  * Make sure Game Center and In-app Purchase settings are set to On.
* Archive the build:
  * Make sure that Product -> Destination is set to iOS Device.
  * Select Product -> Archive.
* Select archived build and click on Distribute.
  * Test: Save for Enterprise or Ad Hoc Deployment <Next>
    * Select the appropriate provisioning file
    * Click Export
    * Save as: <<Choose destination and name>>
      * Suggested name pattern:  NextGear.{version}_{target}.ipa
      * e.g.  NextGear.4.0.3_Test.ipa
  * Prod: Submit to the iOS App Store
* Merge into master branch and tag with build number.
  * git checkout master
  * git merge --no-ff develop
  * git tag {versionNum} (e.g. git tag 4.0.3)
* Push master with its new tag.
  * git push --tags origin master


**Deploy Instructions:**


* Android
  * Upload to Play Store Beta or distribute apk file manually.


* iOS
  * Upload to TestFlight account.
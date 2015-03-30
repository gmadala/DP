###Web Apps


####Build Instructions:  


* Get a report of all bugs/story tickets in Staging (waiting to be deployed to Test Build)
  * JIRA Search:  status = "EUI Staging" AND labels in (EUI) AND project in ("Virtual Office") ORDER BY key ASC, priority DESC
* Pull latest from GIT repository.
  * git checkout develop
  * git pull --rebase
* Create local branch v{versionNum} (e.g. v4.0.1) off development branch.
  * git checkout -b v4.0.1 
* Update version.txt with new build number and update release notes (all fixes/tickets included in build).
* For production builds, version.txt just contains the version number (no reference to JIRA tickets).
* Commit changes.
  * git commit -am "Bumped version to v4.0.1 and updated release notes."
* Run test and jshint tasks to make sure source is in working order
  * grunt jshint
  * grunt test
* Make build according to desired target (e.g. test, production, training)
  * grunt build --target=test
  * grunt build --target=production
  * grunt build --target=training
* Build is packaged into dist/ folder in your project.
* Merge into master branch and tag with build number.
  * git checkout master
  * git merge --no-ff v{versionNum}  (e.g. git merge --no-ff v4.0.1)
  * git tag {versionNum} (e.g. git tag 4.0.1)
* Merge into develop branch.
* Push all tags and changes.
  * git push --tags origin master
  * git push origin develop


####Deploy Instructions:
* Connect to Test or Production server via Remote Desktop Connection (RDP client does not work on latest Mac OS X, need to run in Windows VM->RDP)
  * Test: test.nextgearcapital.com (Crusher)
  * Production: customer.nextgearcapital.com
  * In RDP, open windows explorer and find your mounted shared drive.
* Replace contents of current build with new build.
* Test App Locations
  * Credit App: c:\www\EUI_test\creditApplicationApp
  * Web App: c:\www\EUI_test\webApp
* Production App Locations
  * Credit App:
  * Web App: C:\www\customer


####Marking JIRA Tickets as deployed (test builds):
* Search for project (VO: Web, MOB: mobile) tickets in Staging. JIRA search: status = "EUI Staging" AND labels in (EUI) and project in ("Virtual Office") ORDER BY key ASC, priority DESC
* Select Tools->Bulk Change.
* Select all tickets included in the build and click Next.
* Choose Transition Issues.
* Select Web Deployed.
* Select Next.
* Select Confirm.  
Note: If a story has subtasks that are not resolved (deployed) the story cannot be set to deployed. Deploy all subtasks in JIRA so they appear as Resolved, and then deploy the parent story.

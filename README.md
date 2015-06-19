NextGear - Desktop
==================
NextGear (formerly/also known as DSC) provides financing to auto dealers, who can use NextGear loans to purchase
cars from various sources such as auctions and individual buyers via trade-in. EffectiveUI has been tasked
to create a new UI for their desktop web app, as well as a mobile app, for dealers and auctioneers. To Learn more
about Nextgear Capital [visit their website](http://www.nextgearcapital.com/about/). It is also useful to 
read about Floor Plan Loans [here](http://en.wikipedia.org/wiki/Retail_floorplan) and 
[here](http://www.sba.gov/content/what-floor-plan-financing).

Development Quick Start
-----------------------
1. make sure you have ruby, git and node.js installed (there are various ways to get these; on a Mac, you likely
already have Ruby and can use Homebrew to get the others. Install via instructions at http://brew.sh/ and
then run `brew install node` and/or `brew install git`)

2. make sure you have compass installed (e.g. `sudo gem update --system && gem install compass`)

3. install/update the yeoman toolset: `npm install -g yo` or `npm update -g yo`

4. clone the git repo(s) (you may get an error after clone, "warning: remote HEAD refers to
nonexistent ref, unable to checkout." You can ignore this as the next steps will fix it)

5. cd to the new repository root

6. `git checkout develop` (to switch to the develop branch)

7. `npm install` (to install development dependencies)

8. `bower install` (to install app dependencies)

9. `grunt server` then point a browser to http://localhost:9000 and you should see the app running
(use ?mock in the URL to get mock services)

#Project Setup: Windows
-----------------------
Our team supports Internet Explorer and these are instructions to test IE locally.

#### 1. Install Python 3 and add it to PATH variable (https://www.python.org/downloads/):

   Navigate to Computer > Properties > Advanced Settings > Environmental Variables
   Add to User Variables: PYTHONPATH  C:\Python<Version#>\Lib

Python is a dependency for mock-Api.

#### 2. Install PuTTY Windows exe installer (http://www.putty.org/) from the web.

#### 3. Install mysisgit, both Git Bash and Git GUI, from (https://msysgit.github.io/).

#### 4. Install Node.js (https://nodejs.org/).

#### 5. Install Ruby (http://rubyinstaller.org/).

## Bash specific steps
### (all of the following will need to be done in the Git Bash or another Bash emulator.

#### 6. Install Sass and compass (this assumes you have Ruby and Rubygems already):
    gem update --system
    gem install sass
    gem install compass

#### 7. Install Global Dependencies Yeoman, Karma, bower, grunt, mock-Api, and the Yeoman AngularJS generator:

    npm install -g yo 
    npm install -g generator-angular 
    npm install -g karma 
    npm install -g bower 
    npm install -g grunt 
    npm install -g grunt-cli 
    npm install -g api-mock
    
Installs need to be done separately, you get an error thrown when installing in the same command.

#### 8. Create an SSH-key and add it to Stash. Open Git Bash:

    ssh-keygen
    eval $(ssh-agent -s)
    ssh-add ~/.ssh/id_rsa
    
    In command prompt:
    
    clip < C:\Users\<user.name>\.ssh\id_rsa.pub

Navigate to Stash, Manage Account, SSH-keys, and add it by pasting.

## Project specific steps 
### (all of the following will need to be done in the mobile and desktop root folders separately)

#### 9. Clone Git repo, cd to repo. Optionally Git GUI or SourceTree can be used to clone the repo. 
#### If you are using SourceTree first go to Tools > Options > General and set SSH client to OpenSSH.

    git clone ssh://git@stash.nextgearcapital.com/sus/dealer-portal.git
    cd dealer-portal

#### 10. Install local dependencies with NPM and Bower:
    
    npm install   
    bower install
    
A common gotcha may be that `npm install` fails. This probably happens if you have previously run `sudo npm install`
in which case you will need to run `sudo npm install` or just remove the .npm directory from your home directory and
re-run `npm install`.

#### 11. Configure GIT pre-commit hook:

  Run `grunt githooks` to configure some pre-commit hooks that will check for common errors before commiting code.
  Currently, unit tests, JSHint, and JSCS will be run with the pre-commit hook.
  
#### Before running grunt tasks:
#### 12. Disable CORS on IE 'local intranet' to enable apiBase option

Go into IE > settings > Security tab > Local Intranet. Set the security level to Low. Then go to custom settings and
under 'Miscellaneous' (about 3/4 down the list of options) set 'Access data sources across domains' to Enabled.
  
#### To run see grunt tasks below

#About this README
-----------------------

This document is written in [Markdown](http://daringfireball.net/projects/markdown/) format.

Additionally documentation about the project can be found in the "docs" folder and on
[this Confluence page](https://tardis.discoverdsc.com/confluence/display/CP/myNextGear+Home)

#Project setup
-----------------------

Our team primarily develops on the Mac OS X platform, so here are specific setup instructions for that platform:

#### 1. Download and install the latest [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) from the Apple App Store.

#### 2. Install [Homebrew](http://mxcl.github.io/homebrew/):

    ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"

Note: Homebrew suggests running 'brew doctor' after installation. This will check that you don't have conflicting 
package managers, that you have the latest Xcode and Xcode command-line tools, and that you don't have potentially 
conflicting dylibs in the build location, among other things. Some dylibs it complains about might be OK, see for 
example http://dissociatedpress.net/blog/2012/11/18/til-how-to-find-the-program-that-owns-files-on-mac-os-x/

#### 3. Install Git and Node:

    brew install git node

Note: if you already have git (e.g. the Apple version that comes with Xcode), you can probably omit the "git" part

Note: there's a case where it was necessary to run 'sudo chmod o+w /usr/local/lib/dtrace' to get node to symlink 
successfully (the brew node installation threw clear error messages about linking failing, and how to retry it). The 
node brew formula seems to expect this directory to be world writeable. In this case, it was empty but with more 
restrictive permissions, possibly a leftover from a prior install of node with their OS X Installer .pkg, which was 
removed prior to these steps

Note: The node brew formula spits out some subtle output about the fact that you should add /usr/local/share/npm/bin to 
your PATH. You will want to do this in order to have CLI access to things installed with npm, e.g. the stuff in step 4

#### 4. Install Sass and compass (this assumes you have Ruby and Rubygems already):
    sudo gem update --system
    sudo gem install sass
    gem install compass
    
#### 6. Install Global Dependencies Yeoman, Karma, bower, grunt, and the Yeoman AngularJS generator:

    sudo npm install -g yo generator-angular karma bower grunt grunt-cli
 

## Project specific steps 
### (all of the following will need to be done in the mobile and desktop root folders separately)

#### 7. Clone the git repo, cd to the project root:

    git clone ssh://git@stash.nextgearcapital.com/sus/dealer-portal.git
    cd dealer-portal
    
The "develop" branch should be checked out by default (run `git status` to check which branch is checked out). If it's
not checked out then run `git checkout develop`.
    
#### 8. Install local dependencies with NPM and Bower:
    
    npm install   
    bower install
    
A common gotcha may be that `npm install` fails. This probably happens if you have previously run `sudo npm install`
in which case you will need to run `sudo npm install` or just remove the .npm directory from your home directory and
re-run `npm install`.

#### 9. Configure GIT pre-commit hook:

  Run `grunt githooks` to configure some pre-commit hooks that will check for common errors before commiting code.
  Currently, unit tests, JSHint, and JSCS will be run with the pre-commit hook.
  
  
  
  
  
  
#Grunt tasks
-----------------------

The project uses Grunt for task automation. Use `grunt --help` to list out all available task and the definition.
The primary tasks to be run from the terminal are as follows:

#### server

  This starts the application server. This is also the 'default' Grunt task.

  *Sample usage*

      grunt server --apiBase='https://test.nextgearcapital.com/MobileService/api'
      
  No options or args are required. By default the server will serve the files from *app/* and *.tmp/*
  and reload the browser if there are changes to these directory. This task will also launch Google Chrome in incognito
  mode with security disabled so that the client can be run on localhost but still communicate with a remote API server.
  A local mock api (api/mockApi.js) is used.
  The options are as follows (refer to *app/scripts/config/nxgConfig.js* for common values for the apiBase):
  - noTrack - if true then analytics using segmentio will not be disabled; false by default
  - apiBase - full path to the API; '' by default
  - apiDomain - domain; '' by default; Currently this is only used to get 
  DSCConfigurationService/VirtualOfficeNotificationService.svc/msg info so it is not needed. 
  
#### server-ie

  This starts the application server on internet explorer. Refer to 'server' for a more detailed description.
  
  *Sample usage*
  
        grunt server-ie

  Refer to 'server' for options that can be supplied.
   
#### test:unit

  This runs the Karma unit tests.

  *Sample usage*

      grunt test:unit


#### test:e2e

  This runs the Protractor end-to-end (e2e) tests.

  *Sample usage*

      grunt test:e2e --suite='auction' --params.user='auction' --params.password='test'

  The following options can be supplied:
  - suite - The set of tests to run based on the suite definition found in *e2e/protractor.conf.json*
  - params.user - The user name to use for logging in
  - params.password - The password to user for logging in


#### build

  This builds the application to *dist/* performing tasks such as minification.

  *Sample usage*

      grunt build --target='test'

  The following option should be supplied:
  - target - This is the environment you are building for. Valid values can be found
  in *app/scripts/config/nxgConfig.js*. Currently supported are 'demo', 'test', 'local',
  'training', 'ruby_dal', or 'production'.


#### jshint

  This runs JSHint, checking all the JavaScript files for issues.

  *Sample usage*

      grunt jshint
      

#### jscs

  This runs JSCS, checking all the JavaScript files for style issues.

  *Sample usage*

      grunt jscs


#### test:e2e:users

  This runs the Protractor end-to-end (e2e) tests multiple times for a set of users.
  The user login are currently described in the *Gruntfile.js*

  *Sample usage*

      grunt test:e2e:users --target='test'

  The following options can be supplied:
  - target - If supplied the tests will be run against application files from *dist/* instead of *app/*. 
  Refer to **grunt build** for a description of this option.


#### ci-build

  This the top-level script run for continuous integration. It performs a build
  and runs all tests and a jshint task at the end. This task was setup to assist the DevOps team in setting up the
  continuous build. However, it is currently getting refactoring into smaller pieces.

  *Sample usage*

  grunt ci-build --target='test'

  The following option should be supplied:
  - target - Refer to **grunt build** for a description of this option
  
  
#### server-dist
  
  This task will run build process and start the webapp using data from the test API.
  
#### translate
  
  This task runs several tasks related to preparing and compiling translation files. Refer to /docs/translation
  for detailed information about this task.
  
#Git, Continuous Integration, and Bamboo Projects
-----------------------

Our team uses a simple Git branching strategy for developing features, fixing bugs, etc.
Typically, if you're working on a Jira story during a sprint then you should create a new branch based on the latest 
"develop" branch.

We don't require using a specific naming convention for branches but currently it is highly recommended
to include the Jira Issue (eg. MNGW-4247) in the branch name. This allows Stash to link the commit and pull request
to specific Jira Issues automatically and vice versa (Jira can link to the commit in Stash). Then make commits on your 
local branch and push your changes to Stash. Once the changes are pushed to Stash,
Bamboo is setup to automatically checkout your new branch and do a build. Currently there are two build plans for
dealer-portal in Stash. The first "Dealer Portal Build Only" just builds the application 
(using `grunt build --target="test"`) and archives the build artifact. The second build "Dealer Portal Test" does
a build as well but additionally it runs unit tests, JSHint, and JSCS (`grunt test:unit`, `grunt jshint`, `grunt jscs`)
to look for potential bugs and style errors. It also runs end-to-end (e2e) Protractor tests (`grunt test:e2e`).
Due to the brittle nature of the current e2e tests, the "Dealer Portal Test" plan is set to run only on mac. Despite,
this precaution we do have e2e tests that randomly fail. We also have a lack of e2e tests to test application
functionality (most of the tests simply check navigation and page content).

Once you have implemented the Jira ticket and the acceptance criteria are met, a pull request can be created
in Stash to merge the branch back to "develop". Add all members of the Development Team as reviewers. Members of the 
Development Team can then review the pull request which should include code review and comments
as appropriate. Once at least one member of the Development Team has approved the request, and the Bamboo builds
are green (exceptions can be made for random e2e failures), then the pull request can be merged. Typically, the
developer does the merge and chooses the option to close the feature branch (thus keeping the list of active 
branches tidy).

Once the "Dealer Portal Build Only" build runs successfully for the "develop" branch, then the build artifact is 
automatically deployed to Crusher
to https://test.nextgearcapital.com/develop/ via the Deployment Environment Dealer-Portal Staging.

We try to avoid having long-lived branches. We do try to keep them sync'd with "develop". 
Feature toggles can be used as a good way to integrate new features back into "develop" on a more regular basis. 
A quick implementation of this can be done using the app/scripts/services/features.js service. 
Ideally, we will integrate changes back with "develop" on a daily basis.

Besides creating branches off of "develop" we also have permanent branches for our different environments as follows:

  - develop (test environment that is currently deployed at test.nextgearcapital.com/develop)
  - uat (currently deployed at test.nextgearcapital.com/uat--it uses the same data as "develop")
  - master (production environment that is deployed at customer.nextgearcapital.com)
  - training (currently deployed at training.nextgearcapital.com)
  - demo (currently deployed at demo.nextgearcapital.com)

We use our environment branches to loosely follow the GitLab Flow model described 
[here](https://about.gitlab.com/2014/09/29/gitlab-flow/). This model seems to work well and keeps things very
simple for day to day development. Dealing with hot-fixes is also easy because they can usually be created off
the "uat" branch ranter than "master" which then allows us to test the changes in a non-production environment
before deploying it.

We also have a Bamboo deployment environment "Dealer-Portal Feature Branch" which we can use to manually deploy any
feature branch that we want. These will be deployed to test.nextgearcapital.com/feature/{git-branch-name}.

In advance (days or weeks) of a deployment we will typically merge "develop" into "uat". Typically this is done for a specific 
Sprint increment. The last commit of the Sprint can be conveniently tagged as such and then merge via pull-request.

When we are preparing for deployment to production, demo, or training we an pull request to those different branches.
Once the pull-request is merged Bamboo is setup to do a special build for those branches. They are Plan Branches
and have a specific environment variable called "environment" set to the appropriate deployment environment. 
The value of this variable matches what you will find in app/scripts/config/nxgConfig.js (i.e. "test", "training",
"demo", "production"). Bamboo uses the correct environment value when it builds the artifact for these branches.
This way, we then automatically have the correct artifact ready from that branch to deploy.

The deployed version of the application can easily be checked by finding the Git SHA in /version.txt.

## Getting Started with Git (some hints for beginners) 

You can use Git from the terminal or an IDE such as IntelliJ or Visual Studio. SourceTree is also a popular Git GUI.
It is cross-platform which makes it very useful for doing development on Mac and Windows.

Typical commands for using Git from the terminal are as follows:

1. Create a branch

        git checkout -b MNGW-####-optionaldescription
    
2. Stage and commit changes

        git add myFiles*
        -- or --
        git add -A  (add all files)
        git commit -m "My commit message"
    
3. Store WIP and then recall it later

        git stash
        git stash pop
    
4. Push local commits to Stash

        git push origin myBranchName
    
5. Discard local changes

        git checkout -- myFile (to discard a change to one file)
        git reset --hard HEAD (BE CAREFUL - this discards all local changes)
        git reset --hard HEAD~1 (BE CAREFUL - this discards the last commit--only do this if you haven't pushed 
        changes to the remote server)
    
6. Merge "develop" into your feature branch

        git checkout myBranch
        git merge develop
    
7. Get the latest changes into your branch
    
        git pull 
        -- or --
        git fetch (-v)
        git merge origin/myBranch
    
    
8. Merge a branch and force creating a merge commit. Typically, pull-requests are used in these situations in Stash but
it's not uncommon to merge locally if you need to resolve conflicts.

        git merge --no-ff

#Code Sharing
-----------------------

The mobile-apps project has a lot of the same functionality as the dealer-portal project. They both use the 
MobileService api and have overlapping features. Unfortunately, they were not developed with a common code base
or coding style. This has resulted in various challenges with code maintenance and bugs.

Additionally, there has been some progress made towards a responsive (mobile friendly) dealer-portal application 
that could at some point in the future mostly supplant the mobile-apps project. The idea would be that that the mobile-apps
project would become a thin native shell that would bootstrap the dealer-portal web application (basically a native
app that is just a hyperlink).

With these issues in mind we put in place a simple mechanism to begin refactoring code to a common code base. The 
main angular application module is "nextgearWeb". We created a second module called "nextgearWebCommon". Currently,
files for each module are kept in the same directories but this could be refactored in the future. Then, the mobile-apps
bower.json was modified to import the dealer-portal as a bower package into the mobile-apps project. The mobile-apps project
references the specific Git revision that it needs and references the "nextgearWebCommon" files that it needs in
its index.html and karma.conf.js files.

The main shim that was quickly put in place for this to work is services/apiCommon.js since the api.js service in
each project is different. models/kbb.js is an example of a component in "nextgearWebCommon".

Other approaches using Git submodules or subtrees are also possible but the approach used here was a very quick
way to put something in place without getting new developers into trouble with submodules or subtrees.

With the current bower approach, new services, models, and filters should be created in the "nextgearWebCommon" module
when it makes sense. Some work would need to go into getting directives to be shareable.

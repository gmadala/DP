NextGear - Desktop
==================
NextGear (formerly/also known as DSC) provides financing to auto dealers, who can use NextGear loans to purchase
cars from various sources such as auctions and individual buyers via trade-in. EffectiveUI has been tasked
to create a new UI for their desktop web app, as well as a mobile app, for dealers and auctioneers. To Learn more
about Nextgear Capital [visit their website](http://www.nextgearcapital.com/about/). It is also useful to 
read about Floor Plan Loans [here](http://en.wikipedia.org/wiki/Retail_floorplan) and [here](http://www.sba.gov/content/what-floor-plan-financing).

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

Note: Homebrew suggests running 'brew doctor' after installation. This will check that you don't have conflicting package managers, that you have the latest Xcode and Xcode command-line tools, and that you don't have potentially conflicting dylibs in the build location, among other things. Some dylibs it complains about might be OK, see for example http://dissociatedpress.net/blog/2012/11/18/til-how-to-find-the-program-that-owns-files-on-mac-os-x/

#### 3. Install Git and Node:

    brew install git node

Note: if you already have git (e.g. the Apple version that comes with Xcode), you can probably omit the "git" part

Note: there's a case where it was necessary to run 'sudo chmod o+w /usr/local/lib/dtrace' to get node to symlink successfully (the brew node installation threw clear error messages about linking failing, and how to retry it). The node brew formula seems to expect this directory to be world writeable. In this case, it was empty but with more restrictive permissions, possibly a leftover from a prior install of node with their OS X Installer .pkg, which was removed prior to these steps

Note: The node brew formula spits out some subtle output about the fact that you should add /usr/local/share/npm/bin to your PATH. You will want to do this in order to have CLI access to things installed with npm, e.g. the stuff in step 4

#### 4. Install Sass and compass (this assumes you have Ruby and Rubygems already):
    sudo gem update --system
    sudo gem install sass
    gem install compass
    
#### 6. Install Global Dependencies Yeoman, Karma, bower, grunt, and the Yeoman AngularJS generator:

    sudo npm install -g yo generator-angular karma bower grunt grunt-cli
 

## Project specific steps 
### (all of the following will need to be done in the mobile and desktop root folders separately)

#### 7. Clone the git repo (see Source Control above), cd to the project root, and checkout the develop branch:

    `git checkout develop` 
    
Note: our team pushes to the develop branch often, and upon deployment the tech lead will merge this branch into master.
Our team uses feature branches (with pull requests in Stash). We initially, used a git-flow branching model described
here [read this article](http://nvie.com/posts/a-successful-git-branching-model/) or 
[this one](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
but moved towards the GitLab
Flow model [read this article](https://about.gitlab.com/2014/09/29/gitlab-flow/) which seems to be a better and simpler 
model for us. We don't require using a specific naming convention for branches but currently it is highly recommended
to include the Jira Issue (eg. MNGW-4247) in the branch name. This allows Stash to link the commit and pull request
to specific Jira Issues automatically and vice versa (Jira can link to the commit in Stash).

We have different branches for our different environments:

  - develop (test environment that is currently deployed at test.nextgearcapital.com/develop)
  - uat (currently deployed at test.nextgearcapital.com/uat--it uses the same data as "develop")
  - master (production environment that is deployed at customer.nextgearcapital.com)
  - training (currently deployed at training.nextgearcapital.com)
  - demo (currently deployed at demo.nextgearcapital.com)
  
We also have a Bamboo deployment environment "Dealer-Portal Feature Branch" which we can use to manually deploy any
feature branch that we want. These will be deployed to test.nextgearcapital.com/feature/{git-branch-name}
   
   
#### 8. Install local dependencies with NPM and Bower:
    
    npm install   
    bower install
    
A common gotcha may be that `npm install` fails. This probably happens if you have previously run `sudo npm install`
in which case you will need to run `sudo npm install` or just remove the .npm directory from your home directory and
re-run `npm install`.

#### 9. Configure GIT pre-commit hook:

  - using a code editor open the file .git/hooks/pre-commit.sample and remove the .sample extension
  - paste the following code into your pre-commit file:
  
     `#!/bin/sh`
     
     `grunt test`
     
     `# --no-verify`
     
  - Another option is executing `grunt githooks` which will prepare a pre-commit hook for you.

#Grunt tasks
-----------------------

The project uses Grunt for task automation. Use `grunt --help` to list out all available task and the definition.
The primary tasks to be run from the terminal are as follows:

#### server

  This starts the application server. This is also the 'default' Grunt task.

  *Sample usage*

      grunt server --noTrack=true --apiBase='https://test.nextgearcapital.com/MobileService/api'
      
  No options or args are required. By default the server will serve the files from *app/* and *.tmp/*
  and reload the browser if there are changes to these directory. This task will also launch Google Chrome in incognito
  mode with security disabled so that the client can be run on localhost but still communicate with a remote API server.
  A local mock api (api/mockApi.js) is used.
  The options are as follows (refer to *app/scripts/config/nxgConfig.js* for common values for the apiBase):
  - noTrack - if true then analytics using segmentio will not be disabled; false by default
  - apiBase - full path to the API; '' by default
  - apiDomain - domain; '' by default; Currently this is only used to get 
  DSCConfigurationService/VirtualOfficeNotificationService.svc/msg info so it is not needed. 

#### test:unit

  This runs the Karma unit tests.

  *Sample usage*

      grunt test:unit


#### test:e2e

  This runs the Protractor end-to-end (e2e) tests.

  *Sample usage*

      grunt test:e2e --suite='auction' --params.user='auction' --parms.password='test'

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

  This runs jshint, checking all the JavaScript files for issues.

  *Sample usage*

      grunt jshint


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

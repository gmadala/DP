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
    
Note: our team pushes to the develop branch often, and upon deployment the tech lead will merge this branch into master. To read more about our GIT workflow [read this article](http://nvie.com/posts/a-successful-git-branching-model/)
   
   
#### 8. Install local dependencies with NPM and Bower:
    
    npm install   
    bower install

#### 9. Configure GIT pre-commit hook:

  - using a code editor open the file .git/hooks/pre-commit.sample and remove the .sample extension
  - paste the following code into your pre-commit file:
  
     `#!/bin/sh`
     
     `grunt test`
     
     `# --no-verify`


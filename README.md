NextGear - Desktop
==================
NextGear (formerly/also known as DSC) provides financing to auto dealers, who can use NextGear loans to purchase
cars from various sources such as auctions and individual buyers via trade-in. EffectiveUI has been tasked
to create a new UI for their desktop web app, as well as a mobile app, for dealers and auctioneers.

@todo Flesh out this description and other readme sections

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
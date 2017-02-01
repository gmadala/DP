#!/usr/bin/env bash

# do not allow use of unset vars
set -o nounset


### Pre-Reqs ###

# install compass, bower, and webpack
echo " * gem install compass"
if (gem install compass); then
  echo " * gem installed"
else
  echo " * failed to install gem, exiting"
  exit 1
fi

echo " * sudo npm install -g bower"
if (sudo npm install -g bower); then
  echo " * bower installed globally"
else
  echo " * failed to install bower globally, exiting"
  exit 1
fi

echo " * sudo npm install -g jasmine-node"
if (sudo npm install -g jasmine-node); then
  echo " * jasmine-nodeinstalled globally"
else
  echo " * failed to install jasmine-node globally, exiting"
  exit 1
fi

echo " * sudo npm install -g frisby"
if (sudo npm install -g frisby); then
  echo " * frisby installed globally"
else
  echo " * failed to install frisby globally, exiting"
  exit 1
fi


### Environment ###

# set bower to non-interactive
cat .bowerrc | jq '.interactive = "false"' > bowerrctmp
cat bowerrctmp > .bowerrc
rm -f bowerrctmp

# remove local npm cache from user's home directory
echo " * cleaning npm cache"
if (npm cache clean --verbose); then
  echo " * npm cache cleaned successfully"
else
  echo " * failed to clean npm cache, exiting"
  exit 1
fi

# Install bower packages (have to run before npm install, else bootstrap ECONFLICT)
echo " * installing bower"
if (bower install); then
  echo " * bower installed"
else
  echo " * failed to install bower, exiting"
  exit 1
fi

# Install npm packages
echo " * installing npm"
if (npm install); then
  echo " * npm installed"
else
  echo " * failed to install npm, exiting"
  exit 1
fi

# Remove the test coveage folder
echo " * removing existing test/coverage folder"
if [ ! -d test/coverage ]; then rm -rf test/coverage; fi

# Set up virtual display
echo " * launching virtual frame buffer"
export DISPLAY=:99
Xvfb :99 -shmem -screen 0 1680x1050x16 > /dev/null 2>&1 &


### Test and Build ###

# Lint (user jshint and jscs, or Eslint)
echo " * running eslint"
if (npm run lint:js); then
  echo " * successfully ran eslint"	
else
  echo " * failed to run eslint, exiting the build"
  exit 1
fi

# Build the web artifact using grunt
echo " * DEBUG - the value of bamboo.environment is: ${bamboo_environment}"
echo " * performing the build using grunt with --target=${bamboo_environment}"
if (node_modules/grunt-cli/bin/grunt build --target="${bamboo_environment}"); then
  echo " * build successful"
else
  echo " * build failed, exiting build plan"
  exit 1
fi

# Run unit tests
echo " * running unit tests with grunt"
if (node_modules/grunt-cli/bin/grunt test:unit); then
  echo " * successfully ran unit tests"
else
  echo " * failed running unit tests, exiting the build"
  exit 1
fi

# Run API tests
#echo " * running API tests"
#if (jasmine-node api_tests/ --junitreport --output target/surefire-reports --color --verbose); then
#  echo " * successfully ran API tests"
#else
#  echo " * failed API tests, exiting"
#  exit 1
#fi

# Run End-to-End tests
echo " * running API tests - dev-setup"
if (node_modules/grunt-cli/bin/grunt dev-setup); then
  echo " * dev-setup successfull"
else
  echo " * dev-setup failed, exiting"
  exit 1
fi
echo " * running API tests - updating webdriver"
if (node_modules/grunt-cli/bin/grunt shell:webdriverUpdate); then
  echo " * successfully updated webdriver"
else
  echo " * failed to update webdriver, exiting"
  exit 1
fi
#echo " * running API tests - launching protractor"
#if (node_modules/grunt-cli/bin/grunt protractor); then
#  echo " * protractor ran successfully"
#else
#  echo " * protractor failed, exiting"
#  exit 1
#fi


### Clean up ###

# Shutdown the frame buffer
pkill -f Xvfb\ :99


### Package ###

# Package the dealer-portal artifact
echo "Creating dealer-portal.zip artifact"
if (mkdir -p -v target && cd dist/ && zip -v -r ../target/dealer-portal.zip .); then
  echo "Successfully created dealer-portal artifact"
  WEB_ARTIFACT=0
else
  echo "Failed to create dealer-portal artifact"
  WEB_ARTIFACT=1
fi

# Package the coverage artifact
echo "Creating coverage.zip artifact"
if (mkdir -p -v target && cd test/coverage/ && zip -v -r ../../target/coverage.zip .); then
  echo "Successfully created coverage artifact"
  COVERAGE_ARTIFACT=0
else
  echo "Failed to create coverage artifact"
  COVERAGE_ARTIFACT=1
fi

# Did we package both artifacts?
if [ $WEB_ARTIFACT -eq 0 ] && [ $COVERAGE_ARTIFACT -eq 0 ]; then
  echo "Success"
  exit 0 # both succeeded
else
  echo "Failure"
  exit 1 # both did not succeed
fi

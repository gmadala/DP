#!/bin/bash

# Example Entry point for dockerized build plan
echo " * NOW INSIDE ci/bildr.sh"
cd "$BILDR_DIR"
echo " * current directory is $(pwd)"

# Source the bildr.ENV to grab needed environment variables
echo " * sourcing bildr.ENV"
set -a; source bildr.ENV; set +a

# log our id
echo " * id is $(id)"

# log our docker version
docker --version

# log our docker-compose version
docker-compose --version

# Fix permissions 
echo " * setting ownership of files in $BILDR_DIR to $BILDR_USER - counting changes:"
sudo chown -c -R "$BILDR_UID":"$BILDR_UID" "$BILDR_DIR" | wc -l
echo " * ownership changes complete"

# Ensure that bamboo known_hosts file is up to date (bildr is supposed to do this for us, soon)
if [ "$BILDR_USER" == "bamboo" ]; then
  echo "ls -lahR /home/bamboo/ | grep ssh"
  ls -lahR /home/bamboo/ | grep ssh
  mkdir -p /home/bamboo/.ssh
  KNOWNHOSTSFILE=/home/bamboo/.ssh/known_hosts
  if [ ! -f $KNOWNHOSTSFILE ]; then touch $KNOWNHOSTSFILE; fi
  for KEYSOURCE in bitbucket.org github.com stash.nextgearcapital.com
  do
    KEY=`ssh-keyscan -t rsa "$KEYSOURCE" 2>/dev/null`
    if grep -q "$KEY" "$KNOWNHOSTSFILE"; then
       echo " * $KEYSOURCE found in $KNOWNHOSTSFILE"
    else
       echo " * adding $KEYSOURCE to $KNOWNHOSTSFILE"
       echo "$KEY"  >> "$KNOWNHOSTSFILE"
    fi
  done
  chmod u+rwx /home/bamboo/.ssh
  chmod ugo+r "$KNOWNHOSTSFILE"
  echo " * contents of known_hosts file"
  cat "$KNOWNHOSTSFILE"
fi

# The build plan is in a set of executable shell scripts in a ci/bildr.d/ sub-directory.
#BILDRFILES=ci/bildr.d/*.sh
BILDRFILES=ci/buildplan.sh
for file in $BILDRFILES
do
  echo "------------------------------------------------------------------"
  echo "Processing File -  $file"
  echo "------------------------------------------------------------------"
  echo ""
  $file
  buildplan=$?
  if [ $buildplan -ne 0 ]; then break; fi # leave this loop if we encounter an error
  echo ""
  echo ""
done

# Display the docker-compose log
#echo "------------------------------------------------------------------"
#echo "Displaying contents of docker-compose log"
#echo "------------------------------------------------------------------"
#echo ""
#cat ci/test/logs/compose.log
#echo ""

# Follow with a cleanup script we always run
echo "------------------------------------------------------------------"
echo "Processing ci/bildr-cleanup.sh"
echo "------------------------------------------------------------------"
echo ""
ci/bildr-cleanup.sh  
cleanup=$?
echo ""
echo ""

# Exit cleanly if build and cleanup succeeded
if [ $buildplan -eq 0 ] && [ $cleanup -eq 0 ]; then
  echo "Success"
  exit 0 # both succeeded
else
  echo "Failure"
  exit 1 # both did not succeed
fi


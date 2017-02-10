#!/usr/bin/env bash

echo "* Clean up running containers"

# Stop and remove the running nitro container
echo "* Current running containers are:"
docker ps -a
echo ""
NITRO_CONTAINER=$(docker ps -a 2> /dev/null | grep nitro | awk '{print$1}')
echo "* NITRO_CONTAINER is --->$NITRO_CONTAINER<---"
if [ $NITRO_CONTAINER ]; then
  echo "* Stopping and removing the nitro container with ID = $NITRO_CONTAINER"
  docker rm --force $NITRO_CONTAINER
  rc=$?
  if [ $rc -ne 0 ]; then
    echo "* docker rm --force $NITRO_CONTAINER returned: $rc"
    exit 1
  else 
    echo "* docker rm --force was successful"
  fi
else
  echo "* Did not find a nitro container to stop" 
fi

# Stop mssql container
CONTAINER=$(docker ps -a 2> /dev/null | grep mssql | awk '{print$1}')
echo "* MSSQL CONTAINER is --->$CONTAINER<---"
if [ $CONTAINER ]; then
  echo "* Stopping and removing the mssql container with ID = $CONTAINER"
  docker rm --force $CONTAINER
  rc=$?
  if [ $rc -ne 0 ]; then
    echo "* docker rm --force $CONTAINER returned: $rc"
    exit 1
  else
    echo "* docker rm --force was successful"
  fi
else
  echo "* Did not find a mssql container to stop" 
fi

# Stop seeder container
CONTAINER=$(docker ps -a 2> /dev/null | grep seeder | awk '{print$1}')
echo "* SEEDER CONTAINER is --->$CONTAINER<---"
if [ $CONTAINER ]; then
  echo "* Stopping and removing the seeder container with ID = $CONTAINER"
  docker rm --force $CONTAINER
  rc=$?
  if [ $rc -ne 0 ]; then
    echo "* docker rm --force $CONTAINER returned: $rc"
    exit 1
  else
    echo "* docker rm --force was successful"
  fi
else
  echo "* Did not find a seeder container to stop" 
fi

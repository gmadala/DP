#!/usr/bin/env bash

set -e

# Clean up running bildr containers
for CONTAINERID in `docker ps -a | awk '{print$1}' | grep -v CONTAINER`; do
  if [[ "$CONTAINERID" =~ "$bamboo_buildKey" ]]; then
    echo " * trying: docker rm --force $CONTAINERID"
    docker rm --force "$CONTAINERID"
  fi
done

date=$(date +%Y-%m-%d)
tag=0.0.8
export BILDR_DIR=$(pwd)
export BILDR_USER=$(python -c 'import os; print os.environ["USER"]')
export BILDR_UID=$(python -c 'import os; print os.getuid()')
export BILDR_HOME=$(python -c 'import os; print os.environ["HOME"]')
export BILDR_PLATFORM=$(python -c 'import platform; print platform.platform(terse=True)')
if [[ "$BILDR_PLATFORM" =~ Darwin ]]; then
  export BILDR_DOCKERGID=$(python -c 'import grp; print grp.getgrnam("staff").gr_gid')
elif [[ "$BILDR_PLATFORM" =~ Linux ]]; then
  export BILDR_DOCKERGID=$(python -c 'import grp; print grp.getgrnam("docker").gr_gid')
else
  echo " * Unknown environment, exiting"
  exit 1
fi

# Write bildr environment variables to file to transfer into the container
set | grep -Ei ^BILDR_ > $BILDR_DIR/bildr.ENV

# Write any bamboo environment variables to file to transfer into the container
set | grep -Ei ^bamboo >> $BILDR_DIR/bildr.ENV

#
# Run the container. This will execute ci/bildr.sh as current user
#
echo " * Starting bildr container"
docker run --rm -t --privileged \
  -h "bildr-${bamboo_buildKey}" \
  --name "bildr-${bamboo_buildKey}" \
  --env BILDR_HOME \
  --env BILDR_DIR \
  --env BILDR_USER \
  --env BILDR_UID \
  --env BILDR_DOCKERGID \
  --env BILDR_PLATFORM \
  --group-add "${BILDR_DOCKERGID}" \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "${BILDR_HOME}/.docker/config.json:${BILDR_DIR}/.docker/config.json" \
  -v "${BILDR_HOME}/.ssh/id_rsa:${BILDR_DIR}/.ssh/id_rsa" \
  -v "${BILDR_DIR}:${BILDR_DIR}" \
 docker.nextgearcapital.com/infrastructure/bildr:${tag}

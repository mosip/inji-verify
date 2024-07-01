#!/bin/bash

echo "generating env-config file"
workingDir=$(pwd)
configLocation="${workingDir}/public"

echo "window._env_ = {" > "${configLocation}"/env.config.js
awk -F '=' '{ print $1 ": \"" (ENVIRON[$1] ? ENVIRON[$1] : $2) "\"," }' "${workingDir}"/.env >> "${configLocation}"/env.config.js
echo "}" >> "${configLocation}"/env.config.js

echo "generation of env-config file completed!"

exec "$@"

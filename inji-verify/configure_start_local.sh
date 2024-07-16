#!/bin/bash

echo "generating env-config file"
workingDir=$(pwd)
configLocation="${workingDir}/public"

echo "window._env_ = {" > "${configLocation}"/env.config.js
awk -F '=' '{
    key = $1
    value = substr($0, index($0, "=") + 1)
    print key ": \"" (ENVIRON[key] ? ENVIRON[key] : value) "\","
}' "${workingDir}"/.env >> "${configLocation}"/env.config.js
echo "}" >> "${configLocation}"/env.config.js

echo "generation of env-config file completed!"

exec "$@"

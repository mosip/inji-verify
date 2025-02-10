#!/bin/bash

echo "generating env-config file"
workingDir="$nginx_dir"/html

echo "window._env_ = {" > "${workingDir}"/env.config.js
awk -F '=' '{
    key = $1
    value = substr($0, index($0, "=") + 1)
    print key ": \"" (ENVIRON[key] ? ENVIRON[key] : value) "\","
}' "${workingDir}"/.env >> "${workingDir}"/env.config.js
echo "}" >> "${workingDir}"/env.config.js

echo "generation of env-config file completed!"

exec "$@"
